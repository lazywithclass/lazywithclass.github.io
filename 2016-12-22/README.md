## CSE373 lectures, dynamic programming, ubuntu 16.10 daily crash

### CSE373 2012 - Lecture 21 - Dynamic Programming Examples

https://www.youtube.com/watch?v=o0V9eYF4UI8&index=20&list=PLOtl7M3yp-DV69F32zdK7YJcNXpTunF2b


### CSE373 2012 - Lecture 22 - Applications of Dynamic Programming

https://www.youtube.com/watch?v=dRbMC1Ltl3A&list=PLOtl7M3yp-DV69F32zdK7YJcNXpTunF2b

### Dynamic programming

After three lectures on it I can safely admit didn't get dynamic programming, not at all, not one bit.

Luckily there seems to be a lot of material around, so I could do what prof Skiena suggested in one of the
lectures suggested, which is to study as many examples on dynamic programming as possible, to get a better
understanding of it.

I've found a few links that seem to be good, I will stop the CSE373 until I get a better grasp on the 
argument, here they are:

 * MIT 6.006 - 19. Dynamic Programming I: Fibonacci, Shortest Paths (https://www.youtube.com/watch?v=OQ5jsbhAv_M)
 * MIT 6.046J - R5. Dynamic Programming (https://www.youtube.com/watch?v=krZI60lKPek)
 * Lecture 9: Dynamic Programming, looks like it's been done to be viewed on the web, worth a try (https://www.youtube.com/watch?v=sF7hzgUW5uY)
 * Dynamic Programming for Programming Competitions (https://www.youtube.com/watch?v=Ad0DKl7HUwI)
 * Egg Dropping Dynamic Programming, this guy made lots of example videos on the subject (https://www.youtube.com/watch?v=3hcaVyX00_4) 

It's more links than I am comfortable with, it will halt CSE373 for quite a while, but I think it's crucial.

### Ubuntu 16.10 daily crash

No progress here, I still don't know what caused the problem, I've opened a [question on askubuntu](http://askubuntu.com/questions/863616/screen-turns-greyish-no-command-seem-to-have-effect)
hopefully I will get some hints from there.

Meanwhile the crash happened a couple more times, I've tried to restart using ALT + SysRq + B without success, it seems no input gets through,
I also gave a look at common logs files but without knowing what to look for it's difficult to isolate the bit that tells you about the problem.

I just gave another try to the hunch that this was all avahi-demon's fault, so I did:

```bash
$ sudo systemctl disable avahi-daemon
$ /etc/init.d/avahi-daemon stop 
$ /etc/init.d/avahi-daemon status
```

With the last command returning an inactive state for the daemon, which wasn't happening when I was doing `avahi-demon -k` (I discovered this later on).
