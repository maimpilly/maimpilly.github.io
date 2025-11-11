---
title: 'Real-Time WPT: Identifying Coil Coupling in 5ms on an Embedded STM32'
description: 'A deep dive into my master''s thesis, where I designed and built an embedded system to measure WPT coil alignment in real-time using FFT analysis on an STM32.'
heroImage: '/pictures/projects/01_Testbench.svg'  
badge: 'Master Thesis'
tags: ['Wireless Power Transfer', 'MATLAB', 'Embedded Systems', 'STM32']
githubUrl: 'https://github.com/maimpilly/Master-Thesis'
order: 1
---

For my master's thesis, I tackled a problem I find fascinating: making wireless charging smarter. This project is the summary of my work for the thesis titled, **"Embedded Real-time Identification of Coupling Factor for Inductive Energy Transfer Systems."**

The idea is based on the fact that, Wireless Power Transfer (WPT) systems are incredibly sensitive to coil alignment. A small misalignment can drastically drop efficiency. I wanted to know: could I build a system using a low-cost microcontroller that could *instantly* measure this alignment in real-time? 

**This project was my answer.**

It is a foundation upon which further research would be undertook, for use cases like valet parking and was done with the Institute for Electrical Energy Conversion (IEW).

### Objective
The core problem was to design, build, and validate an embedded system capable of real-time parameter identification for a WPT system. Specifically, I focused on estimating the **coupling factor (*k*)**, a key parameter that directly represents the physical alignment and magnetic coupling between the transmitter and receiver coils.

My goal was to implement this estimation could be done not just accurately (with < 5% error), but fast enough (in the millisecond range) to be used for live control, all while running on a resource-constrained STM32 microcontroller and identifying the effecting factors.

<!--<img 
  src="/pictures/projects/01_concept_block.svg" 
  alt="A diagram showing overall concept" 
  class="max-w-xl mx-auto rounded-lg" 
/>-->
<figure class="mx-auto max-w-xl">
  <!-- This is your resized image tag -->
  <img 
    src="/pictures/projects/01_concept_block.svg" 
    alt="A diagram showing overall concept" 
    class="w-full rounded-lg bg-white p-4" 
  />
  
  <!-- This is the caption -->
  <figcaption class="text-center text-sm italic text-gray-500 mt-2">
    Overall System Architecture
  </figcaption>
</figure>

### My Contribution
As this was my master's thesis, I was responsible for the entire project lifecycle, from concept to final validation, along with supervision from the Institute. My work included:

* **Algorithm Design:** Developing the complete methodology, which uses an "impulse excitation" (a controlled 3-6µs pulse) on the WPT converter, to make the system "ring" like a bell. By analyzing the frequency of that ring, I could determine the coupling.
* **System Simulation:** Building high-fidelity simulation models of the WPT system (using both Series-Series and LCC-LCC compensation topologies) in MATLAB/Simulink and PLECS to prove the theory.

<figure class="max-w-2xl mx-auto">
  <div class="pdf-container"> 
    <iframe 
      src="/pictures/projects/01_schematiclcccropped.pdf" 
      width="100%" 
      height="350px" 
      style="border: 1px solid #ccc; border-radius: 8px;"
    >
      <p>
        Your browser does not support embedded PDFs. 
        <a href="/pictures/projects/01_schematiclcccropped.pdf">Download the PDF</a>.
      </p>
    </iframe>
  </div>
  
  <!-- Add the caption right after -->
  <figcaption class="text-center text-base italic text-gray-500 mt-2">
    PLECS Model of the LCC-LCC compensation circuit for WPT used in the project
  </figcaption>
</figure>

* **Embedded Programming:** Writing and optimizing all the C code for the STM32 microcontroller. This involved implementing the signal processing chain, configuring hardware peripherals, and integrating optimized math libraries.

<!--<img 
  src="/pictures/projects/01_architecture.svg" 
  alt="A simple diagram showing the working of embedded system" 
  class="max-w-xl mx-auto rounded-lg" 
/>-->
<figure class="mx-auto max-w-xl">
  <!-- This is your resized image tag -->
  <img 
    src="/pictures/projects/01_architecture.svg" 
    alt="Overview of Embedded System" 
    class="w-full rounded-lg bg-white p-4" 
  />
  
  <!-- This is the caption -->
  <figcaption class="text-center text-sm italic text-gray-500 mt-2">
    Overview of the Embedded System
  </figcaption>
</figure>

* **Validation & Testing:** I followed a three-stage validation process:
    1.  **Simulation:** Verified the physics in PLECS. This also helped me to prove theoretical possibilities.
    2.  **Processor-in-the-Loop (PIL):** Fed "perfect" simulation data directly to my STM32 code to validate the algorithm's correctness in isolation.
    3.  **Hardware Test Bench:** Built a low-power (<1kW) WPT test bench with a Dual Active Bridge (DAB) inverter to prove the system worked in the real world, complete with noise and component imperfections.

### Technical Details
* **Hardware:** STM32H7A3ZI-Q Development Board, Infineon Full-Bridge Inverters (DAB), Custom-Wound WPT Coils, Tektronix Oscilloscope & Current Probes, Silicon Labs Gate Drivers.
* **Software/Libraries:** C, MATLAB/Simulink, PLECS Blockset, ARM CMSIS-DSP Library.
* **Key Concepts:** Fast Fourier Transform (FFT), Digital Signal Processing (DSP), Impulse Response Analysis, Processor-in-the-Loop (PIL), Direct Memory Access (DMA), Dual Active Bridge (DAB), LCC-LCC & Series-Series (SS) Compensation.


### Challenges & Learnings
This project was a fantastic lesson in bridging the gap between pure simulation and real-world hardware.

#### The eureka effect: Finding the Relationship
My first major finding was in simulation. By sending that impulse and analyzing the resulting current with a **Fast Fourier Transform (FFT)**, a powerful math tool that breaks a signal into its component frequencies, I found a clear, predictable relationship. The *frequency difference* (&Delta;f) between the resonant peaks in the signal's spectrum had a stable cubic relationship to the *coupling factor (k)*. This discovery was the key that made the entire estimation method possible.

It was observed that a SS compensation circuit gave 2 dominant peaks whereas a LCC-LCC compensated circuit gave 4 peaks.

<figure class="mx-auto max-w-xl">
  <!-- The image, now constrained by the max-w-2xl parent -->
  <img 
    src="/pictures/projects/01_lcc-fft.png" 
    alt="Output peaks from PLECS Model" 
    class="w-full rounded-lg" 
  />
  
  <!-- The caption, using the alt text -->
  <figcaption class="text-center text-base italic text-gray-500 mt-2">
    Output peaks from the PLECS simulation model. Voltage (a) and current (b) FFT spectrum for LCC-LCC compensated system. Four peaks numbered from 1 till 4
  </figcaption>
</figure>

#### Challenge: The Need for Speed
The biggest challenge was performance. An FFT is a computationally "heavy" algorithm. Running it in real-time on a microcontroller, which has limited processing power, is not trivial. A simple, non-optimized implementation would be far too slow.

#### Solution: Hardware Acceleration is needed
This forced me to dive deep into the STM32's architecture. The solution was to *stop* the main processor from doing all the work:
1.  **Direct Memory Access (DMA):** I configured the DMA controller to autonomously capture the current sensor's signal and place it into memory. The main CPU was completely free during this data acquisition.
2.  **ARM CMSIS-DSP Library:** I didn't write my own FFT. Instead, I used the `arm_rfft_fast_f32` function from the highly-optimized CMSIS-DSP library, which is tailored specifically for ARM Cortex-M cores and uses the chip's **Floating Point Unit (FPU)**.

The result was a success! My system could acquire the data and compute a 4096-point FFT in **approximately 5 milliseconds**, well within the real-time requirement.

### My Key Takeaway: The Power of PIL Testing
When you're debugging, it's incredibly difficult to know if your *code* is wrong or your *hardware* is noisy. **Processor-in-the-Loop (PIL) testing** was the perfect solution. By feeding the "perfect" data from my PLECS simulation directly to my STM32 board, I could debug my embedded C code in a perfectly controlled environment. When it worked there, I knew my algorithm was solid, and any remaining issues were in the physical test bench setup.



<figure class="mx-auto max-w-xl">
  <!-- The image, now constrained by the max-w-2xl parent -->
  <img 
    src="/pictures/projects/01_tek0038.png" 
    alt="Output peaks from PLECS Model" 
    class="w-full rounded-lg" 
  />
  
  <!-- The caption, using the alt text -->
  <figcaption class="text-center text-base italic text-gray-500 mt-2">
    Output peaks from the Oscilloscope, similar to what was observed in simulation. These are the represented signals: Green (short impulse), cyan (freewheeling current), pink (voltage used to freewheel), and red (FFT peaks) </figcaption>
</figure>

More information about the project and documentations are available in my github.

This project proved that with smart algorithm design and by leveraging on-chip hardware accelerators, it's entirely feasible for low-cost embedded systems to perform the complex, real-time analysis needed to make WPT systems more efficient and adaptive.