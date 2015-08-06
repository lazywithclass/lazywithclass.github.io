# Building the Atreus keyboard

I've always wanted a keyboard that I could easily bring with me, and use it everytime I have to code.<br />
This way I don't have to switch between my laptop keyboard and my work one.

Meet the [Atreus](http://atreus.technomancy.us/).

## Electronics experience not needed

I had never soldered before, nor do I know anything about electronics.<br />
I started around 4pm and I finished around 1am with it working perfectly.

There were of course a few moments in which I was really out of clues and did not how to proceed but I've found help online in the [mailing list](http://atreus.technomancy.us/list) and by looking at the [issues section](https://github.com/technomancy/atreus-firmware/issues?utf8=%E2%9C%93&q=is%3Aissue).<br />
I'm writing this hoping that it could be of some help if anyone gets stuck on any of the passages.

## The steps

The [online instructions](http://atreus.technomancy.us/assembly.pdf) are pretty detailed, the one provided with the kit were not in my case.

### Prerequisites

I got a soldering iron, solder, brush and wire cutters from Halfords, but I think you can get one from almost all DIY shops, what they say it's important is that you don't buy one that's too powerful, your risk damaging the  the board (mine is 25W).

### Sanding / Finishing / Drying

No big issue here, I just followed the instrutions.

### Diodes

Here's where the unknown begun, and finished at 1am :D<br />
Before doing anthing I watched some video to understand the technique, I've found the following to be helpful (the one linked in the guide gives 404):
 * https://www.youtube.com/watch?v=BLfXXRfRIzY gave me an idea of what soldering is
 * https://www.youtube.com/watch?v=oqV2xU1fee8 has an example of exactly what you're going to be doing the whole time (~2:15)
 
 After the first few diodes it becomes straighforward and once you're around the 20th you will see the difference.
 
### Controller
 
 This got me **a lot** of time, this is where I first got stuck.
 
The difficult part is where it says

> Insert a diode leg through the circuit board hole so it touches the already-solder-filled hole on the controller.
> Melt the solder while pushing the diode leg barely through

It really took me ages and at some point, instead of having the leg of the diode to pass through the hole and stick onto the filled hole I made it pass through the filled hole and then into the hole, I just couldn't have it working the other way around, hands shaking or maybe I wasn't focusing enough I don't know. By all means go with the provided instructions, my solution worked but I don't know if I just got lucky. Honestly I'm writing this also as a reminder for my future self in case I forget and I need to undo a few things.

### Switches

When mounting the key cap on top of the switch it is normal for it to apply some resistance, gently push making sure not to bend pins.

This got me a few tries to get working, at some point I realised I connected the switches in the wrong way and they had to be removed. This left me with some filled holes and it took me a good 30 minutes to understand how to work around that, I ended up holding one diode leg with the wirecutter and, with the help of the soldering iron, melted the solder to free the hole again.

### Firmware

This was the second step where I've got stuck.

You have to upload the [firmware](https://github.com/technomancy/atreus-firmware) to the Atreus board to make it behave like a keyboard. To do this you have to:

 * clone the firmware and `cd` into it
 * make sure you have all the dependencies
 * connect your board to the USB, it should flash [like this](http://i.imgur.com/QrSi9tu.gifv)
 * use a diode leg bent to a "V" shape to touch the mentioneed pins twice in under a second, you know you did it correctly if the light stops flashing and starts "breathing" or "pulsating", you will notice the difference
 * now you have 8 seconds to launch the `make` command (in my case it was a nightmare because I run a virtualised Ubuntu and every touch of the pins was unmounting the device, I learnt what "fast" means :D)

### Wrapping up

I checked that the keys were working as expected and of course they were not, I realised I somehow mounted them backwards (pressing "q" was showing "p" on screen), I have only blurred memories of those moments, I was starting to feel tired ^^'. I unsoldered and then proceeded soldering all switches with keycaps on top.
