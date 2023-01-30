var pusage = require('roar-pidusage')
 
pusage.stat(process.pid, function(err, stat) {
 
    expect(err).to.be.null
    expect(stat).to.be.an('object')
    expect(stat).to.have.property('cpu')
    expect(stat).to.have.property('memory')
 
    console.log('Pcpu: %s', stat.cpu)
    console.log('Mem: %s', stat.memory) //those are bytes
 
})
 
// Unmonitor process
pusage.unmonitor(process.pid);
