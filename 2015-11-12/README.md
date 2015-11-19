# Building a module the wrong way, and taking an year to do it

I'm the author of https://github.com/lazywithclass/winston-cloudwatch

I take no joy neither pride in saying so, and probably this is why it has became a huge problem for me.

### How it started

We had the need to put our logs somewhere, I saw the opportunity for something that could be required in the code, rather than added as part of a provisioning script, so I ~~quickly~~ badly put up some code with some useless tests, just to show I had a `test` folder.

The outcome of this was a mess that only recently, after one year, started working decently.
