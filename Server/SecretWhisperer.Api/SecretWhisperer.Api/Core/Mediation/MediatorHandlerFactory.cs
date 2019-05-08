using Appeaser;
using Lamar;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SecretWhisperer.Api.Core.Mediation
{
    public class MediatorHandlerFactory : IMediatorHandlerFactory
    {
        private readonly IServiceContext _context;

        public MediatorHandlerFactory(IServiceContext context)
        {
            _context = context;
        }

        public object GetHandler(Type handlerType)
        {
            return _context.TryGetInstance(handlerType);
        }
    }
}
