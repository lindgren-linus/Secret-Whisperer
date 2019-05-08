using Appeaser;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using SecretWhisperer.Api.Commands;
using SecretWhisperer.Api.Queries;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SecretWhisperer.Api.Controllers
{
    [Route("api/data"), ApiController, AllowAnonymous]
    public class DataController : ControllerBase
    {
        private readonly IMediator _mediator;

        public DataController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult> GetData([FromQuery] Guid token)
        {
            var response = await _mediator.Request(new FetchData.Query(token));
            if (response.Failed)
            {
                return NotFound();
            }

            var stream = new MemoryStream(response.Data);
            return File(stream, "application/octet-stream");
        }

        [HttpPost]
        public async Task<ActionResult<TokenResponse>> PostData()
        {
            using (var ms = new MemoryStream(2048))
            {
                await Request.Body.CopyToAsync(ms);
                var response = await _mediator.Send(new StoreData.Command(ms.ToArray()));
                
                return Ok(new TokenResponse { Token = response.Token });
            }
        }
        
        public class TokenResponse
        {
            public Guid Token { get; set; }
        }
    }
}
