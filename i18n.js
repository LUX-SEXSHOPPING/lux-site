(function () {
  'use strict';

  var languages = {
    'pt-BR': { label: 'Português (Brasil)', country: 'Brasil' },
    'es': { label: 'Español', country: 'Países de habla hispana' },
    'en': { label: 'English', country: 'International' },
    'fr': { label: 'Français', country: 'France' },
    'de': { label: 'Deutsch', country: 'Deutschland' },
    'it': { label: 'Italiano', country: 'Italia' }
  };

  var translations = {
    'es': {
      'Início': 'Inicio', 'Catálogo': 'Catálogo', 'Femininos': 'Mujeres',
      'Masculinos': 'Hombres', 'Pré-Cadastro': 'Preinscripción', 'Agendar': 'Reservar',
      'Sobre': 'Sobre nosotros', 'Termos': 'Términos', 'Contato': 'Contacto',
      'Ver Catálogo': 'Ver catálogo', 'Seja uma VIP': 'Sé una VIP',
      'VER PERFIL COMPLETO': 'VER PERFIL COMPLETO', 'Enviar cadastro': 'Enviar registro',
      'Lista de Espera': 'Lista de espera', 'Voltar': 'Volver'
    },
    'en': {
      'Início': 'Home', 'Catálogo': 'Catalog', 'Femininos': 'Women',
      'Masculinos': 'Men', 'Pré-Cadastro': 'Pre-registration', 'Agendar': 'Book now',
      'Sobre': 'About us', 'Termos': 'Terms', 'Contato': 'Contact',
      'Ver Catálogo': 'View catalog', 'Seja uma VIP': 'Become a VIP',
      'VER PERFIL COMPLETO': 'VIEW FULL PROFILE', 'Enviar cadastro': 'Submit registration',
      'Lista de Espera': 'Waitlist', 'Voltar': 'Back'
    },
    'fr': {
      'Início': 'Accueil', 'Catálogo': 'Catalogue', 'Femininos': 'Femmes',
      'Masculinos': 'Hommes', 'Pré-Cadastro': 'Préinscription', 'Agendar': 'Réserver',
      'Sobre': 'À propos', 'Termos': 'Conditions', 'Contato': 'Contact',
      'Ver Catálogo': 'Voir le catalogue', 'Seja uma VIP': 'Devenez VIP',
      'VER PERFIL COMPLETO': 'VOIR LE PROFIL COMPLET', 'Enviar cadastro': 'Envoyer l’inscription',
      'Lista de Espera': 'Liste d’attente', 'Voltar': 'Retour'
    },
    'de': {
      'Início': 'Startseite', 'Catálogo': 'Katalog', 'Femininos': 'Frauen',
      'Masculinos': 'Männer', 'Pré-Cadastro': 'Vorregistrierung', 'Agendar': 'Buchen',
      'Sobre': 'Über uns', 'Termos': 'Bedingungen', 'Contato': 'Kontakt',
      'Ver Catálogo': 'Katalog ansehen', 'Seja uma VIP': 'VIP werden',
      'VER PERFIL COMPLETO': 'VOLLSTÄNDIGES PROFIL ANSEHEN', 'Enviar cadastro': 'Registrierung senden',
      'Lista de Espera': 'Warteliste', 'Voltar': 'Zurück'
    },
    'it': {
      'Início': 'Home', 'Catálogo': 'Catalogo', 'Femininos': 'Donne',
      'Masculinos': 'Uomini', 'Pré-Cadastro': 'Pre-registrazione', 'Agendar': 'Prenota',
      'Sobre': 'Chi siamo', 'Termos': 'Termini', 'Contato': 'Contatti',
      'Ver Catálogo': 'Vedi catalogo', 'Seja uma VIP': 'Diventa VIP',
      'VER PERFIL COMPLETO': 'VEDI PROFILO COMPLETO', 'Enviar cadastro': 'Invia registrazione',
      'Lista de Espera': 'Lista d’attesa', 'Voltar': 'Indietro'
    }
  };

  function supportedLanguage() {
    var stored = '';
    try { stored = localStorage.getItem('lux-language'); } catch (error) {}
    if (languages[stored]) return stored;
    var browser = (navigator.language || 'pt-BR').toLowerCase();
    if (browser.indexOf('pt') === 0) return 'pt-BR';
    for (var code in languages) {
      if (code !== 'pt-BR' && browser.indexOf(code) === 0) return code;
    }
    return 'en';
  }

  function translate(language) {
    var dictionary = translations[language] || {};
    document.documentElement.lang = language;
    document.querySelectorAll('title').forEach(function (title) {
      title.textContent = title.textContent.replace('Catálogo', dictionary['Catálogo'] || 'Catálogo');
    });
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      if (node.parentElement.closest('#lux-language, script, style')) continue;
      var value = node.nodeValue.trim();
      if (dictionary[value]) {
        node.nodeValue = node.nodeValue.replace(value, dictionary[value]);
      }
    }
    var selected = document.querySelector('#lux-language select');
    if (selected) selected.value = language;
    var country = document.querySelector('#lux-country');
    if (country) country.textContent = 'Atendimento: ' + languages[language].country;
    try { localStorage.setItem('lux-language', language); } catch (error) {}
  }

  var selector = document.createElement('aside');
  selector.id = 'lux-language';
  selector.innerHTML = '<label for="lux-language-select">🌐 <span>Idioma / Language</span></label>' +
    '<select id="lux-language-select" aria-label="Escolha o idioma"></select>' +
    '<small id="lux-country"></small>';
  var style = document.createElement('style');
  style.textContent = '#lux-language{position:fixed;right:14px;bottom:14px;z-index:2000;display:flex;align-items:center;gap:7px;flex-wrap:wrap;max-width:calc(100% - 28px);padding:9px 12px;border:1px solid rgba(201,162,39,.5);border-radius:12px;background:rgba(12,8,9,.94);color:#f0d878;font:12px Segoe UI,sans-serif;box-shadow:0 4px 18px #0008}#lux-language select{border:1px solid #c9a227;border-radius:6px;padding:4px 7px;background:#1a1114;color:#fff}#lux-country{width:100%;color:#cbbfaf}';
  document.head.appendChild(style);
  Object.keys(languages).forEach(function (code) {
    var option = document.createElement('option');
    option.value = code;
    option.textContent = languages[code].label;
    selector.querySelector('select').appendChild(option);
  });
  document.body.appendChild(selector);
  selector.querySelector('select').addEventListener('change', function () {
    translate(this.value);
  });
  var language = supportedLanguage();
  translate(language);
})();
