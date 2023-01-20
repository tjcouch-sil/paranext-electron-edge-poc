using System;
using System.Threading;
using System.Threading.Tasks;

namespace QuickStart.Core
{
    public class LocalMethods
    {
        public async Task<object> GetAppDomainDirectory(dynamic input)
        {
            return AppDomain.CurrentDomain.BaseDirectory;
        }

        public async Task<object> GetCurrentTime(dynamic input)
        {
            return DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        }

        public async Task<object> UseDynamicInput(dynamic input)
        {
            return $".NET Core welcomes {input}";
        }

        public async Task<object> ThrowException(dynamic input)
        {
            throw new Exception("Sample Exception");
        }

        public async Task<object> LongAsyncMethod(dynamic input)
        {
            Console.WriteLine("LongAsyncMethod Start!");
            await Task.Delay(3000);
            Console.WriteLine("LongAsyncMethod Done Delaying!");
            return "LongAsyncMethod finished";
        }

        public async Task<object> LongBlockingMethod(dynamic input)
        {
            Console.WriteLine("LongBlockingMethod Start!");
            Thread.Sleep(3000);
            Console.WriteLine("LongBlockingMethod Done Sleeping!");
            return "LongBlockingMethod finished";
        }
    }
}
