# Logging request body in HAProxy

On the 14th of October HAProxy 1.6 was released! Among [all features announced](http://blog.haproxy.com/2015/10/14/whats-new-in-haproxy-1-6/) I am particularly interested in the ability to log the body of a request.

It wasn't straightforward for me to understand how to do that, which is why I'm blogging it.

The relevant part could be found in the "Captures" section of the announcement, this is how I changed it to suit my needs:

```
# you need this so that HAProxy can access the request body
option http-buffer-request
# declare a capture slot giving it a max length (400) and a reference (0)
declare capture request len 400
http-request capture req.body id 0
# log it
log-format {"%[capture.req.hdr(0)]"}
```

I've create a [small configuration file](https://gist.github.com/lazywithclass/d255bb4d2086b07be178) that could help you start experimenting with this feature.

