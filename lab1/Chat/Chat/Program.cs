using System.Net;
using System.Net.Sockets;
using System.Text;

namespace Chat;

public class Message
{
    public string? Text { get; set; }
    public string? User { get; set; }
    public DateTime Time { get; } = DateTime.Now;

    public Message(string text)
    {
        var result = text.Split('\n');
        if (result.Length > 2)
        {
            Time = new DateTime(Convert.ToInt64(result[0]));
            User = result[1];
            Text = result[2];
        }
        else
        {
            User = result[0];
            Text = result[1];
        }
    }

    public override string ToString()
    {
        return $"{Time.Ticks}\n{User}\n{Text}";
    }
}

public class Chat
{
    private List<Message> Messages { get; } = new List<Message>();

    public void Fetch()
    {
        Console.Clear();
        foreach (var message in Messages.OrderBy(m => m.Time))
        {
            Console.WriteLine($"[{message.Time:hh-mm-ss}] {message.User}: {message.Text}");
        }
    }

    public void NewMessage(Message message)
    {
        if (message.Text.Equals("/exit"))
        {
            message.Text = "Ending conversation.";
        }

        Messages.Add(message);
        Fetch();
    }
}

public static class Program
{
    private static async Task Main()
    {
        var chat = new Chat();
        var localAddress = IPAddress.Parse("127.0.0.1");
        string text = "";

        Console.Write("Enter username: ");
        var username = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(username)) return;

        Console.Write("Enter receive port: ");
        if (!int.TryParse(Console.ReadLine(), out var receivePort)) return;

        Console.Write("Enter send port: ");
        if (!int.TryParse(Console.ReadLine(), out var sendPort)) return;
        Console.Clear();

        // TCP подключение
        var serverEp = new IPEndPoint(localAddress, receivePort);
        using Socket listener = new(
            AddressFamily.InterNetwork,
            SocketType.Stream,
            ProtocolType.Tcp);

        listener.Bind(serverEp);
        listener.Listen(1);
        await ConnectToChat();

        // UDP чат
        Task.Run(ReceiveMessageAsync);
        await SendMessageAsync();

        // Отправка сообщений
        async Task ConnectToChat()
        {
            Console.WriteLine("Ожидание подключения...");

            while (true)
            {
                var clientEp = new IPEndPoint(localAddress, sendPort);

                try
                {
                    using Socket client = new(
                        AddressFamily.InterNetwork,
                        SocketType.Stream,
                        ProtocolType.Tcp);

                    await client.ConnectAsync(clientEp);

                    Console.Clear();
                    break;
                }
                catch
                {
                }
            }
        }


        async Task SendMessageAsync()
        {
            using var sender = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);

            while (true)
            {
                text = "";
                Console.Write("Введите сообщение: ");
                var key = Console.ReadKey();
                while (key.Key != ConsoleKey.Enter)
                {
                    if (key.Key == ConsoleKey.Backspace)
                    {
                        if (!text.Equals(""))
                        {
                            text = text[..^1];
                        }

                        chat.Fetch();
                        Console.Write($"Введите сообщение: {text}");

                        key = Console.ReadKey();
                        continue;
                    }

                    text += key.KeyChar;
                    key = Console.ReadKey();
                }
                
                if (string.IsNullOrWhiteSpace(text))
                {
                    chat.Fetch();
                    continue;
                }

                var mes = new Message($"{username}\n{text}");
                var data = Encoding.UTF8.GetBytes(mes.ToString());
                await sender.SendToAsync(data, SocketFlags.None, new IPEndPoint(localAddress, sendPort));
                
                mes.User = "You";
                chat.NewMessage(mes);
                if (text.Equals("/exit"))
                {
                    sender.Close();
                    break;
                }
            }
        }

        // Прием сообщений
        async Task ReceiveMessageAsync()
        {
            var data = new byte[65535];
            using var receiver = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);
            receiver.Bind(new IPEndPoint(localAddress, receivePort));

            while (true)
            {
                // получаем данные
                var result =
                    await receiver.ReceiveFromAsync(data, SocketFlags.None, new IPEndPoint(localAddress, sendPort));
                var mes = new Message(Encoding.UTF8.GetString(data, 0, result.ReceivedBytes));
                var exitCode = mes.Text;
                chat.NewMessage(mes);

                if (exitCode.Equals("/exit"))
                {
                    receiver.Close();
                    Environment.Exit(0);
                }

                Console.Write($"Введите сообщение: {text}");
            }
        }
    }
}