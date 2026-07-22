// Rodapé LUX — Componente JavaScript
export function criarRodape() {
  const rodape = document.createElement('footer');
  rodape.className = 'rodape-lux';

  rodape.innerHTML = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
      @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

      :root {
        --neon-rosa: #ff1493;
        --neon-claro: #ff69b4;
        --fundo-escuro: rgba(8, 5, 10, 0.9);
        --texto-suave: #b8b0b3;
        --texto-claro: #f0e9ec;
      }

      .rodape-lux {
        background: var(--fundo-escuro);
        border-top: 2px solid rgba(255, 20, 147, 0.3);
        box-shadow: 0 -4px 25px rgba(255, 20, 147, 0.15);
        padding: 2rem 4%;
        margin-top: 3rem;
        color: var(--texto-suave);
        font-family: 'Segoe UI', sans-serif;
      }

      .conteudo-rodape {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1.5rem;
      }

      .logo-rodape {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 2rem;
        letter-spacing: 0.3rem;
        color: #ffffff;
        text-shadow:
          0 0 4px var(--neon-rosa),
          0 0 12px var(--neon-rosa);
      }

      .contato-rodape p {
        margin: 0.5rem 0;
        display: flex;
        align-items: center;
        gap: 0.6rem;
      }

      .contato-rodape i {
        color: var(--neon-rosa);
      }

      .contato-rodape a {
        color: var(--texto-suave);
        text-decoration: none;
        transition: color 0.3s;
      }

      .contato-rodape a:hover {
        color: var(--neon-rosa);
        text-shadow: 0 0 8px var(--neon-rosa);
      }

      .direitos {
        width: 100%;
        text-align: center;
        padding-top: 1.5rem;
        margin-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 0.9rem;
      }

      .direitos strong {
        color: var(--neon-claro);
      }

      @media (max-width: 768px) {
        .conteudo-rodape {
          justify-content: center;
          text-align: center;
        }
        .logo-rodape {
          font-size: 1.6rem;
        }
      }
    </style>

    <div class="conteudo-rodape">
      <div class="logo-rodape">LUX</div>

      <div class="contato-rodape">
        <p><i class="fa-brands fa-whatsapp"></i> 
          <a href="https://wa.me/5551980612941" target="_blank">(51) 98061-2941</a>
        </p>
        <p><i class="fa-solid fa-location-dot"></i> Brasil • Europa</p>
        <p><i class="fa-solid fa-envelope"></i> contato@lux.com</p>
      </div>
    </div>

    <div class="direitos">
      © 2026 <strong>LUX</strong> — Todos os direitos reservados. | 
      Elegância, discrição e sofisticação.
    </div>
  `;

  return rodape;
}

export function inserirRodape() {
  const rodape = criarRodape();
  document.body.appendChild(rodape);
}
