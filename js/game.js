// Neon Runner loader
(async function(){
  const parts = await Promise.all([
    fetch('js/g1.txt').then(r=>r.text()),
    fetch('js/g2.txt').then(r=>r.text())
  ]);
  const b64 = parts.join('');
  const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  if (typeof DecompressionStream === 'undefined') {
    document.body.insertAdjacentHTML('beforeend','<div style="color:#fff;padding:30px">Atualize o navegador para jogar.</div>');
    return;
  }
  const ds = new DecompressionStream('gzip');
  const stream = new Blob([bin]).stream().pipeThrough(ds);
  const text = await new Response(stream).text();
  const s = document.createElement('script');
  s.textContent = text;
  document.body.appendChild(s);
})().catch(e=>{
  console.error(e);
  document.body.insertAdjacentHTML('beforeend','<div style="color:#f66;padding:20px">Erro: '+e.message+'</div>');
});
