# CSE373 lesson, work on winston-cloudwatch, Emacs xwidgets (-175)

https://days.to/31-may/2017

I'm going to write mostly every day as part of my journey, I hope
this will work as a preparation for my Recurse Center batch next year: I've seen 
lot of people documenting their experience over the whole length, to try
to maximise their learning. So I suppose this doesn't have any value for anyone
except me.

Anyway here it is:

 * CSE373 2012 - Lecture 16 - Graph Algorithms (con't 3)

 https://www.youtube.com/watch?v=jgDOQq6iWy8&list=PLOtl7M3yp-DV69F32zdK7YJcNXpTunF2b&index=16

 * Released version 1.10.0 for winston-cloudwatch 

https://github.com/lazywithclass/winston-cloudwatch

 * Started looking into a bug reported for winston-cloudwatch
 
 https://github.com/lazywithclass/winston-cloudwatch/issues/55

 * Embedding WebKit in Emacs: XWidgets+WebKit Feature Preview

https://www.youtube.com/watch?v=J2YdjpWJJHs

I'm trying to see if there's some way to programmatically talk to XWidgets, 
specifically talk with WebKit, it would be great to be able to evaluate JavaScript code.

### Installing Emacs

This is what I did to get to a version that has XWidgets capability

```bash
$ sudo add-apt-repository -y ppa:ubuntu-elisp
$ sudo apt-get update
$ sudo apt-get install emacs-snapshot
```

### Playing with XWidget and WebKit

I know nothing about XWidget and WebKit.

That aside I think there's room for some fun here, possibly some learning 
and ah-ha moments, I don't think I can extract something usable.

This is what I got first after some trial and error:

```lisp
(let ((my-widget (make-xwidget 'webkit "my-widget" 1 1 nil)))
      (xwidget-webkit-execute-script my-widget "alert(eval(1 + 1))"))

```

Which alerts `2`. Good so far.

I am thinking about smart auto completion, given 

```javascript
function test() { 
  return { answer: 42 }
}

var result = test()
```

when I type in Emacs `test.an` I would like the autocompletion feature
to suggest `test.answer`, and not just because it's already in the same file, 
maybe along with the returned type.

It's a strange feeling coding something being certain you're not going
to have anything usable out of it.

```lisp
(let ((my-widget (make-xwidget 'webkit "my-widget" 1 1 nil)))
  (xwidget-webkit-execute-script my-widget "window.result = 1 + 1")
  (xwidget-webkit-execute-script my-widget "alert(window.result)"))
```

This is what I got as next experiment, but I don't think this is a viable
way of doing things, too slow, I will look into WebKit APIs tomorrow.
