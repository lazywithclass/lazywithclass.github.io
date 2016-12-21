# CSE373 lectures, Ubuntu 16.10 daily crash, winston-cloudwatch process inspection

I finally relocated back to Italy, I will now have way more time to study as I am
taking a month and a half off (till RC which is in early February).

### CSE373 2012 - Lecture 19 - Introduction to Dynamic Programmig
 
https://www.youtube.com/watch?v=Qc2ieXRgR0k&feature=youtu.be&list=PLOtl7M3yp-DV69F32zdK7YJcNXpTunF2b

### CSE373 2012 - Lecture 20 - Edit Distance
 
https://www.youtube.com/watch?v=IsmMhMdyeGY&index=20&list=PLOtl7M3yp-DV69F32zdK7YJcNXpTunF2b

### Ubuntu 16.10 daily crash
 
 It looks like the problem was not about avahi-demon, as `avahi-demon -k` did not solve it.
 
 I run `sudo apt-get update && sudo apt-get upgrade` and got a kernel update, I will wait to see if
 this fixes it.
 
### winston-cloudwatch process inspection
  
I've added some more information and colours to help recognise the payload from
the string identifying the place in the code where the call originated from.

There are two minor problems I'm aware of, minor because the library seems
to work correctly:

 1. Sometimes when `node examples/multiple-loggers.js` I get
 
 > { InvalidSequenceTokenException: The given sequenceToken is invalid. The next expected sequenceToken is: XXX
 > [...]
 > message: 'The given sequenceToken is invalid. The next expected sequenceToken is: XXXXXX',
 > code: 'InvalidSequenceTokenException',
 > time: 2016-12-21T22:34:22.215Z,
 > requestId: 'YYY',
 > statusCode: 400,
 > retryable: false,
 > retryDelay: 88.9125096887647 }

It has to do with the fact that I'm issuing two calls almost simultaneously, 
in fact only one of the two calls fails, the strange thing is that logging does 
not resume afterwards.

 2. https://github.com/lazywithclass/winston-cloudwatch/issues/55, which should
 not happen, it shouldn't be possible to arrive in 
 lib/cloudwatch-integration.json with an empty payload, it could be due the fact
 that I am changing `logEvents` in place and using it within a `setInterval`, but
 that's just a guess.
