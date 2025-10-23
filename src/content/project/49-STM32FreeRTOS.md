---
title: 'Diving into FreeRTOS: A Multi-Tasking App on the STM32'
description: 'My hands-on project building a real-time application with FreeRTOS, demonstrating multitasking, message queues, and mutexes on an STM32.'
heroImage: '/post_img.webp'
tags: ['RTOS', 'STM32', 'Embedded Systems', 'Real-Time Systems']
githubUrl: 'https://github.com/maimpilly/STM32-FreeRTOS-Application'
order: 49
---

As an engineer, I'm comfortable writing C code for microcontrollers, but I've always been fascinated by the next level of complexity: how do you manage *multiple* things happening at once? How does a real-world device read a sensor, listen for a button press, and update a display "at the same time" without becoming a tangled mess of code? This is the exact problem that a **Real-Time Operating System (RTOS)** is designed to solve.

To truly understand this, I went hands-on. The goal was to experience concepts that I heard in lectures (Pre-emptive scheduling, mutex, etc.). I set up a project on an STM32 Nucleo board with the goal of building a "real" application from scratch, moving beyond a simple blinky to implement the core pillars of an RTOS.

### Objective
My goal was to demonstrate and master three fundamental RTOS concepts using FreeRTOS on an STM32H7:

1.  **Pre-emptive Multitasking:** To have two independent tasks run concurrently without interfering with each other.
2.  **Inter-Task Communication:** To create an event-driven system where one task (a button press) can safely send data to another task (an LED).
3.  **Shared Resource Management:** To allow two tasks to share a single piece of hardware (the UART serial port) without a **race condition**, a classic bug where they try to use it at the same time and corrupt the data.

### My Contribution
I designed and wrote this application from the ground up using the STM32CubeIDE. My process involved:

* **System Configuration:** CubeIDE's graphical tool to configure the MCU's clocks, GPIO pins (for LEDs and the button), and the UART peripheral.
* **RTOS Configuration:** I enabled the FreeRTOS middleware (using the CMSIS v2 API) and configured its settings.
* **Application Logic:** Wrote C code for the three main tasks:
    1.  A simple periodic task for the slow-blinking LED.
    2.  A "producer" task that monitors the user button.
    3.  A "consumer" task that waits on an event to toggle the second LED.
* **Debugging:** I used the serial port as my console to print status messages and verify that the system was running as expected, especially after implementing the mutex.

### Technical Details
* **Hardware:** STMicroelectronics NUCLEO-H743ZI2 (ARM Cortex-M7)
* **Software/Libraries:** C, FreeRTOS (CMSIS-RTOS v2 API)
* **Toolchain:** STM32CubeIDE
* **Key Concepts:** Pre-emptive Multitasking, Message Queues (Producer/Consumer), Mutexes (Mutual Exclusion), Race Conditions, Thread-Safe Design

### Challenges & Learnings
This project had a series of moments that made me recall certain concepts, as I saw RTOS theory come to life in code.

#### 1. Learning: `osDelay()` is Not a "Pause"
My first step was creating two tasks to blink two LEDs at different rates. The "magic" is the `osDelay()` function. In bare-metal C, a `HAL_Delay()` blocks the *entire system*. In an RTOS, `osDelay()` is totally different: it's a message to the scheduler that says, "I'm done for now, put me to sleep and go run another task. Wake me up in 2 seconds." This is the core of **pre-emptive multitasking**, and seeing both LEDs blink perfectly out of sync proved it worked.

#### 2. Learning: Queues are Better than Global Variables
My next challenge: how to make one task react to another. The "bad" way is to use a global flag. The "good" way is with a **queue**.

* **Problem:** I needed my button-reading task to tell my LED-toggling task to "go." A global variable is not "thread-safe", what if the button is pressed twice before the LED task can read the flag? An event would be lost.
* **Action:** I implemented a FreeRTOS **queue**. The button task became a "producer," adding a message to the queue when the button was pressed. The LED task became a "consumer," spending all its time *blocked* (sleeping) while waiting for a message.
* **Result:** This was incredibly powerful. The LED task uses *zero* CPU time while it's waiting. As soon as the button task sends a message, the RTOS instantly wakes up the LED task, which runs, toggles the light, and goes back to sleep. This event-driven pattern is the foundation of efficient, responsive design.

#### 3. Learning: The Mutex and the "Race Condition"
My final challenge was the "Oh, *that's* why!" moment.

* **Problem:** I had both my LED tasks print a status message to the serial port (UART). The result was a garbled mess, like `Task 1: LED ToggTlaesdk 2: LED Toggled`. This is a classic **race condition**, where both tasks tried to write their data at the exact same time.
* **Action:** I fixed this using a **mutex** (which stands for "mutual exclusion"). A mutex is a "lock" that only one task can hold at a time.
* **Result:** I wrapped my UART print statements in a `osMutexAcquire()` and `osMutexRelease()` block. Now, when Task 1 wants to print, it takes the lock. If Task 2 tries to print, the RTOS sees the lock is taken and automatically puts Task 2 to sleep. When Task 1 is done, it releases the lock, and the RTOS wakes Task 2 up to finally print *its* message. The output became perfectly clean, and I had a tangible, real-world example of how to protect shared resources.

This project was the perfect step up from bare-metal programming. It solidified my understanding of *why* an RTOS is so critical for building any embedded system that is complex, responsive, and reliable.