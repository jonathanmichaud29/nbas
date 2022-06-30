import logo from '../assets/logo.jpg'

import { ISetMeta } from '../Interfaces/meta';

const defaultTitleSuffix = " | NBAS";

export function setDefaultMetas(){
  let el;

  // Set Logo as default image
  el = document.querySelector('meta[property="og:image"]');
  if( el ) el.setAttribute("content", logo);

  // Change Robots
  if( process.env.NODE_ENV !== 'production'){
    el = document.querySelector('meta[name="robots"]');
    if( el ) el.setAttribute("content", "noindex,nofollow");
  }

  // Set Current URL without GET params
  el = document.querySelector('meta[property="og:url"]');
  if( el ) {
    let currentUrl = window.location.href;
    currentUrl = currentUrl.split("?")[0];
    el.setAttribute("content", currentUrl);
  }
}

export function setMetas( params: ISetMeta) {
  const { url, title, description, image, ommitTitleSuffix } = params;

  let el;

  if( title ){
    el = document.querySelector('title');
    if( el ) el.textContent = title + ( ommitTitleSuffix === true ? '' : defaultTitleSuffix);
  }

  if( description ){
    el = document.querySelector('meta[name="description"]');
    if( el ) el.setAttribute("content", description);

    el = document.querySelector('meta[property="og:description"]');
    if( el ) el.setAttribute("content", description);
  }

  if( image ){
    el = document.querySelector('meta[property="og:image"]');
    if( el ) el.setAttribute("content", image);
  }
  

  if( url ){
    el = document.querySelector('meta[property="og:url"]');
    if( el ) el.setAttribute("content", url);
  }
}