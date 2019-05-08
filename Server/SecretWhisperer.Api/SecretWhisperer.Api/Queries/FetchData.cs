using Appeaser;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SecretWhisperer.Api.Queries
{
    public class FetchData 
    {
        public class Query : IAsyncQuery<Response>
        {
            public Query(Guid token)
            {
                Token = token;
            }

            public Guid Token { get; set; }
        }

        public class Handler : IAsyncQueryHandler<Query, Response>
        {
            private readonly IMemoryCache _cache;

            public Handler(IMemoryCache cache)
            {
                _cache = cache;
            }

            public Task<Response> Handle(Query request)
            {
                if (_cache.TryGetValue(request.Token, out byte[] data))
                {
                    _cache.Remove(request.Token);
                    return Task.FromResult(new Response { Data = data });
                }

                return Task.FromResult(new Response { Failed = true }); ;
            }
        }

        public class Response
        {
            public bool Failed { get; set; }
            public byte[] Data { get; set; }
        }
    }
}
