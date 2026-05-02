/* Pre-Loader — Globe Canvas + Text Reveal (Vibrant Dark) */
export function initPreloader() {
  return new Promise((resolve) => {
    const preloader = document.getElementById('preloader');
    const canvas = document.getElementById('preloader-canvas');
    const brand = document.getElementById('preloader-brand');
    const ctx = canvas.getContext('2d');
    let width, height, cx, cy, radius, rotation = 0, animId;
    const startTime = Date.now(), GLOBE_DURATION = 2200;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      width = rect.width; height = rect.height;
      canvas.width = width * dpr; canvas.height = height * dpr;
      ctx.scale(dpr, dpr); cx = width/2; cy = height/2; radius = Math.min(width,height)*0.38;
    }
    resize();

    function drawGlobe() {
      ctx.clearRect(0,0,width,height);
      // Vibrant outer glow
      const glow = ctx.createRadialGradient(cx,cy,radius*0.5,cx,cy,radius*1.5);
      glow.addColorStop(0,'rgba(232,148,58,0.1)');
      glow.addColorStop(0.5,'rgba(232,148,58,0.03)');
      glow.addColorStop(1,'transparent');
      ctx.fillStyle = glow; ctx.fillRect(0,0,width,height);

      // Globe outline
      ctx.strokeStyle = 'rgba(232,148,58,0.3)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx,cy,radius,0,Math.PI*2); ctx.stroke();

      // Inner ring
      ctx.strokeStyle = 'rgba(232,148,58,0.1)'; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.arc(cx,cy,radius*0.7,0,Math.PI*2); ctx.stroke();

      // Latitude lines
      for (let i=-2;i<=2;i++) {
        const lat=(i/3)*radius, r=Math.sqrt(radius*radius-lat*lat);
        ctx.strokeStyle = `rgba(255,255,255,${0.06+Math.abs(i)*0.02})`;
        ctx.lineWidth=0.8;
        ctx.beginPath(); ctx.ellipse(cx,cy+lat,r,r*0.15,0,0,Math.PI*2); ctx.stroke();
      }
      // Longitude lines (rotating)
      for (let i=0;i<6;i++) {
        const angle=(i/6)*Math.PI+rotation, xOff=Math.cos(angle)*radius;
        ctx.strokeStyle='rgba(255,255,255,0.06)'; ctx.lineWidth=0.8;
        ctx.beginPath(); ctx.ellipse(cx,cy,Math.abs(xOff),radius,0,0,Math.PI*2); ctx.stroke();
      }
      // Animated travel arcs — vibrant
      const elapsed = Date.now()-startTime;
      const arcs = [
        {from:-30,to:60,lat:-0.2,color:'#e8943a'},
        {from:20,to:120,lat:0.15,color:'#f5b041'},
        {from:-80,to:10,lat:0.35,color:'#ff6b6b'},
      ];
      arcs.forEach((arc,idx) => {
        const progress=Math.min(1,(elapsed-idx*300)/1200);
        if(progress<=0) return;
        const eased=1-Math.pow(1-progress,3);
        const sa=((arc.from+rotation*57.3)*Math.PI)/180;
        const ea=sa+((arc.to-arc.from)*Math.PI/180)*eased;
        const lo=arc.lat*radius, r=Math.sqrt(radius*radius-lo*lo);
        ctx.strokeStyle=arc.color; ctx.lineWidth=2.5; ctx.globalAlpha=0.8*eased;
        ctx.beginPath(); ctx.ellipse(cx,cy+lo,r,r*0.2,0,sa,ea); ctx.stroke();
        ctx.globalAlpha=1;
        const dx=cx+r*Math.cos(ea), dy=cy+lo+r*0.2*Math.sin(ea);
        ctx.fillStyle=arc.color; ctx.beginPath(); ctx.arc(dx,dy,4,0,Math.PI*2); ctx.fill();
        // Glow dot
        ctx.fillStyle=arc.color; ctx.globalAlpha=0.3;
        ctx.beginPath(); ctx.arc(dx,dy,8,0,Math.PI*2); ctx.fill();
        ctx.globalAlpha=1;
      });
      // Center dot
      ctx.fillStyle='#e8943a'; ctx.beginPath(); ctx.arc(cx,cy,4,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(232,148,58,0.2)'; ctx.beginPath(); ctx.arc(cx,cy,10,0,Math.PI*2); ctx.fill();
      rotation+=0.008;
    }

    function animate() {
      drawGlobe();
      if (Date.now()-startTime < GLOBE_DURATION+400) animId=requestAnimationFrame(animate);
    }
    animate();

    setTimeout(() => {
      canvas.style.opacity='0';
      setTimeout(() => {
        cancelAnimationFrame(animId);
        brand.style.opacity='1';
        const letters=brand.querySelectorAll('.preloader-brand-name span');
        const tagline=brand.querySelector('.preloader-tagline');
        letters.forEach((l,i) => { setTimeout(()=>{l.style.transition='all 500ms cubic-bezier(0.16,1,0.3,1)';l.style.transform='translateY(0)';l.style.opacity='1';},i*70); });
        setTimeout(()=>{tagline.style.transition='all 600ms cubic-bezier(0.16,1,0.3,1)';tagline.style.opacity='1';tagline.style.transform='translateY(0)';},letters.length*70+200);
        setTimeout(()=>{
          preloader.style.transition='transform 1000ms cubic-bezier(0.76,0,0.24,1), opacity 600ms ease';
          preloader.style.transform='translateY(-100%)'; preloader.style.opacity='0';
          document.body.classList.remove('preloader-active');
          setTimeout(()=>{preloader.style.display='none';resolve();},1000);
        },letters.length*70+1000);
      },500);
    },GLOBE_DURATION);
  });
}
