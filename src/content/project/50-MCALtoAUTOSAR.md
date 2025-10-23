---
title: 'From MCAL to AUTOSAR: A Journey Through the Automotive Software Stack'
description: 'How I taught myself the core layers of automotive software, from a C-based MCAL driver to a Python CAN bus and a full AUTOSAR application.'
heroImage: '/pictures/projects/50_autosar.png'
tags: ['AUTOSAR', 'CAN Bus', 'MCAL', 'Embedded Systems', 'Python', 'Automotive']
order: 50
---

I've always been fascinated by the sheer complexity hidden inside a modern car. My time working with tier 1 automotive suppliers only deepened that curiosity. I saw how a single vehicle operates as a network of dozens of mini-computers (ECUs), all communicating flawlessly.

**But *how***?

How does the application logic (like a seatbelt warning) get data from a physical sensor? How does it **"talk"** to the warning light in the dashboard?

I wasn't satisfied with just knowing the high-level theory. I wanted to build it.

To answer these questions for myself, I embarked on a side quest: to build a "virtual car" from the ground up, one layer of the automotive software stack at a time. This post covers that journey, from the first line of code to a functioning system.

### 1. The Foundation: Simulating the MCAL
My journey started at the very bottom: the hardware. How does software talk to the "metal"?

* **Problem:** High-level code needs to control physical hardware (like a sensor or chip), but it can't just "talk" to it. It needs a translator.
* **Action:** I built a virtual low-level driver in C to simulate the **MCAL (Microcontroller Abstraction Layer)**. This is the software layer that directly controls the hardware registers. I designed a "virtual" SPI peripheral with its own control, status, and data registers. My C code then used bitwise operations to configure and interact with these simulated registers.
* **Result:** I created a clean, reusable API with two functions: `Spi_Init()` and `Spi_ReadWriteByte()`. Any "application" could now just call these functions without ever needing to know the complex register addresses or bitmasks.

<figure class="mx-auto max-w-xl">
  <!-- 
    1. We add "bg-white p-4" to give the transparent SVG 
       a clean white background and some padding.
  -->
  <img 
    src="/pictures/projects/50_SPI_daisy_chain.svg" 
    alt="A diagram of SPI with three daisy-chained slaves" 
    class="w-full rounded-lg bg-white p-4" 
  />
  <figcaption class="text-center text-gray-500 mt-2">
  <!-- This is your main caption -->
  <span class="text-base italic">Diagram of SPI with daisy-chained slaves.</span>
  
  <!-- This is the small, less opaque attribution line -->
  <span class="block text-xs opacity-40 mt-1">
    Image by <a href="https://commons.wikimedia.org/wiki/User:Omegatron" target="_blank" rel="noopener noreferrer" class="underline">Omegatron</a>, 
    licensed under <a href="https://creativecommons.org/licenses/by-sa/3.0/deed.en" target="_blank" rel="noopener noreferrer" class="underline">CC BY-SA 3.0</a>.
  </span>
</figcaption>
</figure>

* **Learning:** This project clarified the *why* behind hardware abstraction. The MCAL's job is to create a "black box" that hides the messy, specific details of the hardware, providing a simple, standard interface to the layers above it.

### 2. The Nervous System: Simulating the CAN Bus
With a single "component" sorted, my next question was how to get it to talk to *other* components, just like in a real car.

* **Problem:** A car's ECUs (like the Engine and Dashboard) are physically separate. They need a robust network to exchange data.
* **Action:** I built a simulator for the **CAN (Controller Area Network) bus**, the vehicle's internal nervous system. I used **Python** and **UDP sockets** to mimic the broadcast-style nature of CAN. I created two separate scripts:
    1.  `engine_ecu.py`: A "producer" that faked RPM and speed data.
    2.  `dashboard_ecu.py`: A "consumer" that listened for that data.

![A simple diagram showing the CAN bus simulated over UDP, with an Engine ECU and a Dashboard ECU communicating.](/pictures/projects/50_CAN.png)
<figcaption class="text-center text-base italic text-gray-500 mt-2 mb-8">
 Diagram showing the CAN bus simulated over UDP, with an Engine ECU and a Dashboard ECU communicating.
</figcaption>

* **Result:** I had a live, running simulation! The engine ECU would encode its data into a raw byte payload (in the format of CAN messages), and the dashboard would receive those bytes, decode them, and display the correct RPM and speed in real-time.
* **Learning:** This taught me the core principles of in-vehicle networking. I had to design a message format, handle the (de)serialization of data into bytes, and manage a "producer-consumer" relationship, all of which are central to how real ECUs communicate.

### 3. The Application: Building an AUTOSAR SWC
I had hardware drivers (MCAL) and a network (CAN). Now, how do I write the *actual application logic* in a way that's standardized, reusable, and testable?

* **Problem:** Application code (like a "seatbelt reminder") shouldn't care if its data comes from a direct sensor or a CAN message. It just needs to run its logic.
* **Action:** I dived into **AUTOSAR (AUTomotive Open System ARchitecture)**, the industry-standard blueprint for this. I built a virtual **SWC (Software Component)** in C for a seatbelt reminder.
* **Result:** I created a self-contained "black box" of logic with clearly defined ports (like `R_VehicleSpeed` and `P_WarningLight`). To test it, I also built a "stubbed" **RTE (Run-Time Environment)**, which fed my component *fake* data, similar to how a real car would. This allowed me to create a test harness (`main.c`) that ran my component through various scenarios (e.g., "ECU asleep," "sensor fault," "speed OK").

![Simple block diagram](/pictures/projects/50_autosar_swc.png)
<figcaption class="text-center text-base italic text-gray-500 mt-2 mb-8">
  Block Diagram of the implemented SWC.
</figcaption>

* **Learning:** This gave the final insights. AUTOSAR provides the final, highest layer of abstraction. My SWC is completely decoupled from *everything*. It doesn't know about MCAL or CAN. It just reads from its "ports" via the RTE. This is what makes automotive software so robust, testable, and reusable across different cars and hardware.

### My "Virtual Car" Stack & Repositories

This bottom-up approach was an incredible learning experience. Each project built directly on the last, giving me a holistic view of how these complex systems are built.

* **Layer 1 (MCAL):** [MCAL Driver Simulation (GitHub)](https://github.com/maimpilly/MCAL-Driver-Sim)
* **Layer 2 (CAN):** [Python CAN Bus Simulator (GitHub)](https://github.com/maimpilly/CAN-Simulator)
* **Layer 3 (AUTOSAR):** [Virtual AUTOSAR SWC (GitHub)](https://github.com/maimpilly/Virtual-AUTOSAR-Software-Component)