## CSE373 lecture, Ubuntu weirdness, winston-cloudwatch behaviour (-174)

### CSE373 2012 - Lecture 17 - Backtracking

https://www.youtube.com/watch?v=RM89rxDh3XQ&list=PLOtl7M3yp-DV69F32zdK7YJcNXpTunF2b&index=17

### Addressed the caps-twice-halts-your-pc and suspend-loop problems

The first was the most puzzling one: pressing caps twice in a row would halt my pc with a weird scrambled graphics effect on the monitor.
It turned out to be a quite [common](https://www.reddit.com/r/razer/comments/5cxpx7/help_razer_blade_stealth_with_ubuntu_1604_suspend/) [problem](https://www.reddit.com/r/razer/comments/447vrn/razer_blade_stealth_linux/) and somehow linked to the suspend-loop one.

The caps wasn't a real problem with me since I always remap it to CTRL.

Solving the suspend was a bit trickier and in the end involved adding a parameter to grub boot params.

I've never done that in the past but it turned out to be easy thanks to [this askubuntu post](http://askubuntu.com/a/19487/6201): 
instead of `foo=bar` just append `button.lid_init_state=open`, then follow the instructions.

I rebooted my laptop and the problem went away...

![but why](https://media.giphy.com/media/1M9fmo1WAFVK0/giphy.gif)

[This post](https://patchwork.kernel.org/patch/9285379/) sums it nicely enough (at least for a kernel newbie like me):

> On most platforms, _LID returning value, lid open/close events are all
> reliable, but there are exceptions.
>
> [...]
>
> In order not to trigger issues on such buggy platforms, the ACPI button
> driver currently implements a lid_init_state=open quirk to send additional
> "open" event after resuming.

and also on the same matter, the [same person suggest the fix](https://lkml.org/lkml/2016/6/1/275).

[Archlinux advises for the same fix, for exactly my laptop](https://wiki.archlinux.org/index.php/razer#Suspend_Loop).

Oh, and there's also a bug for this: https://bugzilla.kernel.org/show_bug.cgi?id=187271

* Errors in winston-cloudwatch console output

It looks like, despite my efforts to never send empty logs, there are some edge case scenarios in which a payload with empty `logEvents` is sent 
to AWS, which answers with an error, making users of the library worried about its correctness.

I think the action here is add another check before invoking `aws.putLogEvents`, and to create a sample app that constantly sends log to AWS
CloudWatch so that I can spot errors or strange behaviours.
