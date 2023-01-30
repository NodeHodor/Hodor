var json = require("morgan-json")
try{
    json(null);
    json(false);
    json(true);
    json(0);
    json(1);
    json(Number.MAX_VALUE);
    json(Number.POSITIVE_INFINITY);
    json('');
} catch (error) {
}
try{
    json(false);
    json(true);
    json(0);
    json(1);
    json(Number.MAX_VALUE);
    json(Number.POSITIVE_INFINITY);
    json('');
} catch (error) {
}
try{
    json(true);
    json(0);
    json(1);
    json(Number.MAX_VALUE);
    json(Number.POSITIVE_INFINITY);
    json('');

} catch (error) {
}
try{
    json(0);
    json(1);
    json(Number.MAX_VALUE);
    json(Number.POSITIVE_INFINITY);
    json('');
} catch (error) {
}
try{
    json(1);
    json(Number.MAX_VALUE);
    json(Number.POSITIVE_INFINITY);
    json('');
} catch (error) {
}
try{
    json(Number.MAX_VALUE);
    json(Number.POSITIVE_INFINITY);
    json('');

} catch (error) {
}
try{
    json(Number.POSITIVE_INFINITY);
    json('');
} catch (error) {
}
try{
    json('');

} catch (error) {
}
