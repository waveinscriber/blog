---
layout: layouts/blogpost.njk
title: Streaming My Android Tablet's Audio to PC
description: How to stream an Android device's audio to PC and toggle the mute with a keyboard shortcut
date: 2026-10-23
---

I like watching/listening to Twitch streams in the background while I do other things on the PC. Problem is, the Twitch website is too slow and takes up too much RAM, so even though my setup has a second screen, using it for Twitch isn't good for performance. The mobile app isn't too bad though, so now my Android tablet acts as a third smaller screen for streams.

Wanting to listen to both the stream and my PC audio, I discovered the [Bluetooth Audio Receiver app](https://apps.microsoft.com/detail/9n9wclwdqs5j). It uses something called A2DP to make the PC act as an audio sink, receiving audio from the tablet. After setting up and pairing the tablet with the PC, the tablet's audio appears as a microphone input in Windows and it's possible to control its volume and mute it from the volume mixer.

That's all great but there are times I want to quickly mute and unmute the stream. My choices are to either take my hand off the keyboard and press the mute button on the Twitch app on my tablet, or go into the Windows volume mixer and mute the tablet from there. That's all too slow and inconvenient if I'm doing something on the PC and need to quickly toggle the mute.

All that led me to [SoundVolumeView](https://www.nirsoft.net/utils/sound_volume_view.html) which can see and control pretty much any audio device connected to the PC. It also acts as a CLI tool so it's possible to toggle the mute on my tablet with a script. The command itself is pretty simple:

```powershell
.\SoundVolumeView.exe /Switch "Your Device Name"
```

You can find the full device name in the volume mixer. In my case, when I hover over the mute button of the device, the tooltip says `Microphone (2- Galaxy Tab A9+ A2DP SNK) (Mute App)`. The name in the first parentheses is the only relevant part:

```powershell
.\SoundVolumeView.exe /Switch "2- Galaxy Tab A9+ A2DP SNK"
```

However, when I ran the script the first time I noticed it wasn't working as expected. After opening the SoundVolumeView GUI, I saw that the device wasn't even appearing in the app's list. I believe it's something to do with how the app gets its list of devices and how A2DP interacts with it. I found a fix for this - there is an entry in Registry Editor you can remove so it shows up for SoundVolumeView. If the device already appears in your case and the command is working, then you can skip this part. Otherwise, follow along for the fix.

Open Registry Editor and paste this in the address bar at the top:

```
Computer\HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\MMDevices\Audio\Capture
```

Under the Capture folder you'll see a bunch of GUID folders. Each one represents an audio capture device and one of those is the device we're looking for.

1. Look inside each GUID folder's `Properties` folder for your device's name.
2. Once you've found the correct device, right-click its GUID folder and choose Export. Save the `.reg` file as your backup so you can restore the deleted value by importing it.
3. In that device's `Properties` folder, find and delete the value named `{9c119480-ddc2-4954-a150-5bd240d454ad},6`.

Deleting this allows SoundVolumeView to see your device and control it, though I still don't know how it works. Anyway, the script should be working now.

---

This is some decent progress but still less convenient than muting on the tablet itself or through the volume mixer. We need to be able to assign a keyboard shortcut to this script so we can toggle the mute without our hand leaving the keyboard. Fortunately, there is a well-known and very useful tool called [AutoHotkey](https://www.autohotkey.com/).

AutoHotkey is mainly used for automating tasks and making macros. It has its own scripting language and syntax. It can control your keyboard, mouse and run other applications. We will leverage that to create a simple macro so we can assign a keyboard shortcut to the SoundVolumeView command. After installing AutoHotkey, all I had to do was create an `.ahk` file, open it in a text editor and paste this in there:

```autohotkey
!]::Run '"C:\Path\To\SoundVolumeView.exe" /Switch "2- Galaxy Tab A9+ A2DP SNK"'
```

Pretty minimal syntax for a simple task. Double-clicking the `.ahk` file starts the script, and `Alt+]` now toggles mute on my tablet. I chose that combination because it’s unlikely to get pressed accidentally or conflict with another app’s shortcuts. Use whatever you like; you can find the hotkey syntax here [https://www.autohotkey.com/docs/v2/Hotkeys.htm](https://www.autohotkey.com/docs/v2/Hotkeys.htm).

Opening the `.ahk` file after every restart is another problem. The fix is easy - create a shortcut of the file, navigate to `C:\Users\YourUser\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup` and place it there. Now Windows will automatically run the file on startup.

The setup is complete. I can now listen to streams on my PC without the Twitch website hogging my resources, and I have a keyboard macro ready to toggle the mute anytime.