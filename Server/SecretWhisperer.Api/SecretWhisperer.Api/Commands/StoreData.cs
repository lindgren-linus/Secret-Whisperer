using Appeaser;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SecretWhisperer.Api.Commands
{
    public class StoreData 
    {
        public class Command : IAsyncCommand<Response>
        {
            public Command(byte[] data)
            {
                Data = data;
            }

            public byte[] Data { get; set; }
        }

        public class Handler : IAsyncCommandHandler<Command, Response>
        {
            private readonly IMemoryCache _cache;

            public Handler(IMemoryCache cache)
            {
                _cache = cache;
            }

            public Task<Response> Handle(Command request)
            {
                var token = Guid.NewGuid();
                _cache.Set(token, request.Data);
                return Task.FromResult(new Response { Token = token });
            }
        }

        public class Response
        {
            public Guid Token { get; set; }
        }
    }
}
