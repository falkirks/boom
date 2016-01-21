boom
====

I was really bored so I made a cute little link sharing tool concept. It works, but it doesn't check properly for errors and stuff.

If you want to share a link you fire up a terminal and

```sh
$ telnet <server> 8888
Trying <server>...
Connected to localhost.
Escape character is '^]'.
Welcome to the Telnet server!
http://example.com/thisIsWhatYouAreSharing
title=Give it a title
message=And maybe a message thing too to describe it fully...
@send
```

Now the link is available. You can tell someone to go to `<server>` in their browser and they will see the link you published. When they click it you will be notified through telnet. Once you are done sharing the link, just exit out of telnet and it will be cleared out.

You can share multiple links at once.

