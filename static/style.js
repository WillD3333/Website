document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".container");
    const scroller = document.querySelector(".scroller");
    const progressCounter = document.querySelector(".progress-counter h1");
    const progressBar = document.querySelector(".progress-bar");
    const sections = Array.from(scroller.querySelectorAll("section"));
    
    const smoothFactor = 0.05;
    const touchSens = 2.5;
    const bufferSize = 2;

    let targetScrollX = 0;
    let currScrollX = 0;
    let isAnimating = false;
    let currProgScale = 0;
    let targProgScale = 0;
    let lastPct = 0;

    let isDown = false;
    let lastTouchX = 0;
    let touchVelo = 0;
    let lastTouchTime = 0;

    const lerp = (start, end, factor) => start+ (end-start)*factor;

    const setUpScroll = () => {
        scroller
        .querySelectorAll(".clone-section")
        .forEach((clone => clone.remove()));
        
        const origSection = Array.from(scroller.querySelectorAll("section:not(.clone-section)"))
        const templateSections = 
            origSection.length>0 ? origSection : sections;
        let seqWidth = 0;
        templateSections.forEach((section) => {
            seqWidth += parseFloat(window.getComputedStyle(section).width);
        });
        for(let i = -bufferSize; i<0; i++){
            templateSections.forEach((section,index) => {
                const clone = section.cloneNode(true);
                clone.classList.add("clone-section");
                clone.setAttribute("data-clone-index", `${i} - ${index}`);
                scroller.appendChild(clone);
            });
        }
        if(origSection.length == 0){
            templateSections.forEach((section, index) =>{
               const clone = section.cloneNode(true);
               clone.setAttribute("data-clone-index", `0-${index}`);
               scroller.appendChild(clone); 
            });
        }
        for(let i = 1; i<bufferSize; i++){
            templateSections.forEach((section, index) =>{
                const clone = section.cloneNode(true);
                clone.classList.add("clone-section");
                clone.setAttribute("data-clone-index", `${i} - ${index}`);
                scroller.appendChild(clone);
            });
        }
        scroller.style.width = `${seqWidth * ( 1+bufferSize*2)}px`;
        targetScrollX = seqWidth * bufferSize;
        currScrollX = targetScrollX;
        scroller.style.transform = `translateX(-${currScrollX})`;
        return seqWidth;
    };

    const checkBoundaryReset = (seqWidth) => {
        if(currScrollX > seqWidth * (bufferSize + 0.5)){
            targetScrollX -= seqWidth;
            currScrollX -= seqWidth;
            scroller.style.transform = `translateX(-${currScrollX}px)`;
            return true;
        }
        if(currScrollX < seqWidth * (bufferSize-0.5)){
            targetScrollX+=seqWidth;
            currScrollX += seqWidth;
            scroller.style.transform = `translateX(-${currScrollX}px)`;
            return true;
        }
        return false;
    };

    const updateProg = (seqWidth, forceReset = false) => {
        const basePos = seqWidth * bufferSize;
        const currPos = (currScrollX - basePos) % seqWidth;
        let percentage = (currPos / seqWidth) * 100;
        
        if(percentage < 0){
            percentage = 100 + percentage;
        }
        const isWrapping =  
        (lastPct > 80 && percentage < 20) || 
        (lastPct<20 && percentage> 80) || 
        forceReset;

        progressCounter.textContent = `${Math.round(percentage)}`;

        targProgScale = percentage/100;

        if(isWrapping){
            currProgScale = targProgScale;
            progressBar.style.transform = `scaleX(${currProgScale})`;
        }
        lastPct = percentage;
    };
    const animate = (seqWidth, forceProgReset = false) => {
        currScrollX = lerp(currScrollX, targetScrollX, smoothFactor);
        scroller.style.transform = `translateX(-${currScrollX}px)`;
        updateProg(seqWidth,forceProgReset);

        if(!forceProgReset){
            currProgScale = lerp(
                currProgScale,
                targProgScale, 
                smoothFactor
            );
            progressBar.style.transform = `scaleX(${currProgScale})`;
        }
        
        if(Math.abs(targetScrollX - currScrollX) < 0.01){
            isAnimating = false;
        } else {
            requestAnimationFrame(() => animate(seqWidth));
        }
         
    };

    const seqWidth = setUpScroll();
    updateProg(seqWidth, true);
    progressBar.style.transform = `scaleX(${currProgScale})`;
    
    container.addEventListener("wheel", (e) => {
        e.preventDefault();
        targetScrollX += e.deltaY;

        const needsReset = checkBoundaryReset(seqWidth);

        if(!isAnimating){
            isAnimating= true;
            requestAnimationFrame(() => animate(seqWidth, needsReset));
        }
      },
    {passive: false}
    );

});

