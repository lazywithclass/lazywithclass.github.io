## CSE373 lecture, winston-cloudwatch process inspection, Ubuntu 16.10 daily crash (-168)

### CSE373 2012 - Lecture 18 - Exhaustive Search & Backtracking

https://www.youtube.com/watch?v=usxrn66JDEo&feature=youtu.be&list=PLOtl7M3yp-DV69F32zdK7YJcNXpTunF2b

### winston-cloudwatch process inspection 
 
 Started creating a couple scripts to mimic a real life process that logs
 to AWS CloudWatch, basically a running process that listens for `SIGUSR1`
 and a sh script that sends that signal.
 
 The goal is to find out if calling `setInterval` in winston-cloudwatch
 is working as I think it is, I am seeing some weird behaviour. One example 
 is that `logEvents` is passed through to the integration library file as empty,
 which is something that should not happen, feels like I a missing something 
 obvious about how Node.js works in this scenario.
 
 Also it looks like when I'm logging twice in a row as in 
 
```JS
winston.loggers.get('category1').error('1');
winston.loggers.get('category2').error('2');
```

two intervals are started, which is something that should not happen.

### Dealing with continuous crashes on my Ubuntu 16.10
 
 I have half a dozen error reports a day, plus once a day the screen freezes with a gray color with
 a graphical effect as if it was an old TV being turned off (a central white line collapsing to a dot).
 
 Sometimes I get an extended error report saying
 
 > avahi-demon crashed with SIGABRT in avahi_malloc
 
 This is `avahi-demon` man page https://linux.die.net/man/8/avahi-daemon, which looks like a service
 discovery tool. 
 
 I gave a look at `avahi-demon --help` and it looks like `avahi-demon -k` killed it.
 
 I will give it a couple days to see if I still get so many crashes and error reports. If it will turn out
 to be responsible I could either remove it, update it, or just disable it at startup, so if I will
 ever need to discover something like a printer I could always turn it back on. (and of course I will never
 remember of this decision)
