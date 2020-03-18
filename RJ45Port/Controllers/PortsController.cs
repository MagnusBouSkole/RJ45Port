using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using RJ45Port;

namespace RJ45Port.Controllers
{
    public class PortsController : ApiController
    {
        private Model db = new Model();

        // GET: api/Ports
        public IQueryable<Port> GetPorts()
        {
            return db.Ports;
        }

        // GET: api/Ports/5
        [ResponseType(typeof(Port))]
        public IHttpActionResult GetPort(int id)
        {
            Port port = db.Ports.Find(id);
            if (port == null)
            {
                return NotFound();
            }

            return Ok(port);
        }

        // PUT: api/Ports/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutPort(int id, Port port)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != port.Id)
            {
                return BadRequest();
            }

            db.Entry(port).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PortExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Ports
        [ResponseType(typeof(Port))]
        public IHttpActionResult PostPort(Port port)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Ports.Add(port);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = port.Id }, port);
        }

        // DELETE: api/Ports/5
        [ResponseType(typeof(Port))]
        public IHttpActionResult DeletePort(int id)
        {
            Port port = db.Ports.Find(id);
            if (port == null)
            {
                return NotFound();
            }

            db.Ports.Remove(port);
            db.SaveChanges();

            return Ok(port);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PortExists(int id)
        {
            return db.Ports.Count(e => e.Id == id) > 0;
        }
    }
}