(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const c of t.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function i(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(e){if(e.ep)return;e.ep=!0;const t=i(e);fetch(e.href,t)}})();document.addEventListener("DOMContentLoaded",()=>{const o=document.querySelector(".menu-toggle"),r=document.querySelector(".docs-sidebar"),i=document.querySelector(".sidebar-overlay");o&&r&&i&&(o.addEventListener("click",()=>{r.classList.toggle("active"),i.classList.toggle("active")}),i.addEventListener("click",()=>{r.classList.remove("active"),i.classList.remove("active")}),window.addEventListener("resize",()=>{window.innerWidth>768&&(r.classList.remove("active"),i.classList.remove("active"))})),document.addEventListener("click",s=>{const e=s.target.closest("[data-link]");e&&(s.preventDefault(),history.pushState(null,"",e.href),r&&i&&window.innerWidth<=768&&(r.classList.remove("active"),i.classList.remove("active")))})});
