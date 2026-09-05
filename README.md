# LUX — servidor de pré-cadastro

O site continua servindo as páginas estáticas, mas agora também pode ser executado
com um servidor Node para receber os pré-cadastros. Cada cadastro aceita no
máximo **2 fotos** e **1 vídeo** de até 100 MB. Os arquivos ficam privados até
que um administrador aprove o perfil.

## Executar

```bash
npm install
ADMIN_TOKEN=uma-senha-segura npm start
```

Em produção, use HTTPS e defina `ADMIN_TOKEN` como um segredo do ambiente.
Os dados são gravados em `data/cadastros.json` e os arquivos em
`data/uploads/`; essa pasta não deve ser versionada nem publicada.

## Aprovar um cadastro

Liste os cadastros pendentes:

```bash
curl -H "x-admin-token: uma-senha-segura" http://localhost:3000/api/pre-cadastros
```

Aprove usando o `id` retornado:

```bash
curl -X POST -H "x-admin-token: uma-senha-segura" \
  http://localhost:3000/api/pre-cadastros/ID/aprovar
```

Somente cadastros aprovados aparecem em `/api/catalogo` e no catálogo feminino.
