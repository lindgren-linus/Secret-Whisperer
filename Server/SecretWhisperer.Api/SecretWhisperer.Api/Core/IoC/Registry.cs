using Appeaser;
using Lamar;
using SecretWhisperer.Api.Core.Mediation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SecretWhisperer.Api.Core.IoC
{
    public class Registry : ServiceRegistry
    {
        public Registry()
        {
            For<ISimpleMediator>().Use<Mediator>();
            For<IMediator>().Use<Mediator>();

            For<IMediatorHandlerFactory>().Use<MediatorHandlerFactory>();
            ForSingletonOf<IMediatorSettings>().Use(CreateSettings());
            Scan(s =>
            {
                s.AssemblyContainingType<Registry>();
                s.ConnectImplementationsToTypesClosing(typeof(IRequestHandler<,>));
                s.ConnectImplementationsToTypesClosing(typeof(IAsyncRequestHandler<,>));
            });
        }

        private MediatorSettings CreateSettings()
        {
            return new MediatorSettings { WrapExceptions = false };
        }
    }
}
