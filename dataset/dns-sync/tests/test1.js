var dnsSync = require('dns-sync');

try{
    dnsSync.resolve('www.example.com')
} catch(error) {

}
try{
    dnsSync.resolve('www.paypal.com')
} catch(error) {
    
}
try{
    dnsSync.resolve('www.biying.com')
} catch(error) {
    
}
try{
    dnsSync.resolve('www.yahoo.com')
} catch(error) {
    
}



try{
    dnsSync.resolve('www.example.con')
} catch(error) {
    
}
try{
    dnsSync.resolve('www.not-google.first')
} catch(error) {
    
}
try{
    dnsSync.resolve('www.hello-yahoo.next')
} catch(error) {
    
}



try{
    dnsSync.resolve("$(id > /tmp/foo)'")
} catch(error) {
    
}
try{
    dnsSync.resolve("cd /tmp; rm -f /tmp/echo; env 'x=() { (a)=>\' bash -c \"echo date\"; cat /tmp/echo")
} catch(error) {
    
}
try{
    dnsSync.resolve("$(grep -l -z '[^)]=() {' /proc/[1-9]*/environ | cut -d/ -f3)'")

} catch(error) {
    
}




try{
    var aaaa = dnsSync.resolve('www.biying.com', 'AAAA');

} catch(error) {
    
}

try{
    dnsSync.resolve('www.biying.com')
} catch(error) {
    
}




try{
    var ns = dnsSync.resolve('biying.com', 'NS');
    ns[0].match(/^ns[0-9]+\.biying\.com$/)
} catch(error) {
    
}