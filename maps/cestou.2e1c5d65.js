function e(e){"Polygon"===e.type?e=e.coordinates[0]:"MultiPolygon"===e.type?e=e.coordinates[0][0]:"Point"===e.type?e=[e.coordinates]:"LineString"===e.type&&(e=e.coordinates);let t=[1/0,1/0,-1/0,-1/0];return e.forEach(e=>{(e[0]<t[0]||!t[0])&&(t[0]=e[0]),(e[1]<t[1]||!t[1])&&(t[1]=e[1]),(e[0]>t[2]||!t[2])&&(t[2]=e[0]),(e[1]>t[3]||!t[3])&&(t[3]=e[1])}),t}function t(t){let o=e(t);return[(o[0]+o[2])/2,(o[1]+o[3])/2]}function o(e,t){let o=e=>e*Math.PI/180,[a,i]=e,[n,r]=t,s=o(i),l=o(r),c=o(r-i),d=o(n-a),m=Math.sin(c/2)*Math.sin(c/2)+Math.cos(s)*Math.cos(l)*Math.sin(d/2)*Math.sin(d/2);return Math.round(2*Math.atan2(Math.sqrt(m),Math.sqrt(1-m))*6371e3)}function a(e,t){return(void 0===t&&(t=2),e>1e4)?(e/1e3).toLocaleString(void 0,{maximumFractionDigits:t})+" km":e.toLocaleString()+" m"}function i(e,t){let o=e<0?t?"O":"S":t?"E":"N",a=0|(e<0?e=-e:e),i=0|(e+=1e-9)%1*60,n=(0|60*e%1*6e3)/100;return a+"° "+(i<10?"0":"")+i+"' "+(n<10?"0":"")+n.toFixed(2)+'" '+o}function n(e,t){let o=Math.trunc((e/=1e3)/60),a=e-60*o;return t?o+"'"+(a<10?"0":"")+a.toFixed(0)+'"':o+" mn "+(a<10?"0":"")+a.toFixed(0)+" s"}function r(e,t){let o=document.createElement(e.toLowerCase());return Object.keys(t).forEach(e=>{switch(e){case"parent":t.parent.appendChild(o);break;case"html":o.innerHTML=t.html;break;default:o[e]=t[e]}}),o}var s=function(e){MapIFrameAPI.ready("map1",function(t){e.mapAPI1=t,t.getCenter(t=>e.startPosition=t),t.getLayers(o=>{e.layers=o,o.forEach(e=>{t.setLayer({id:e.id,visible:3===e.id})}),["zoom","mousePosition","layerSwitcher","profil","printDlg","legend","searchBar","permalink","locate"].forEach(e=>{t.mapControl({id:e,visible:!1})})}),t.getFeatures({layerId:18},t=>{e.features=t,e.mapAPI2&&e.ready()}),t.layout({css:`
      .map .ol-control.ol-permalink {
        display: none;
      }
      .map .ol-scale-line {
        left: 1em;
        right: unset;
      }
    `})}),MapIFrameAPI.ready("map2",function(t){e.mapAPI2=t,[2,14,18].forEach(e=>{t.setLayer({id:e,displayInLayerSwitcher:!1,visible:!1})}),t.addLayerFeatures({id:2,features:[],clear:!0}),t.getLayers(o=>{e.layers=o,o.forEach(e=>{t.setLayer({id:e.id,visible:e.id<4})})}),e.debug||t.setCenter({extent:[-4.8,41.15,9.8,51.23]}),t.on("move",e=>{var t;document.querySelector("section .coords").innerHTML=i((t=e.center)[0],!0)+"<br/>"+i(t[1])}),t.layout({css:`
      .ol-control.ol-search {
        left: 14em;
      }
      .ol-control.ol-rotate,
      .ol-control.ol-layer-shop {
        right: 13em;
      }
      .ol-control.ol-attribution {
        bottom: 4em;
        right: 13em;
      }
      .ol-scale-line {
        bottom: 4.5em;
        right: auto;
        left: 1em
      }
      map .ol-control.ol-permalink {
        display: none;
      }
      .ol-overlaycontainer-stopevent:before,
      .ol-overlaycontainer-stopevent:after {
        content: '';
        position: absolute;
        top: calc(50% - 5px);
        left: 0%;
        width: 100%;
        height: 10px;
        pointer-events: none;
        background-image: linear-gradient(90deg, #000 2px, transparent 2px), 
          linear-gradient(0deg, transparent 29px, #000 29px, #000 31px, transparent 31px);
        background-size: 60px 60px;
        background-position: center;
      }
      .ol-overlaycontainer-stopevent:after {
        top: 0%;
        left: calc(50% - 5px);
        width: 10px;
        height: 100%;
        background-image: linear-gradient(0deg, #000 2px, transparent 2px), 
          linear-gradient(90deg, transparent 29px, #000 29px, #000 31px, transparent 31px);
      }
      `}),e.mapAPI1&&e.features&&e.ready()})};const l=document.querySelector("dialog.intro");l.showModal(),l.querySelector("button").addEventListener("click",e=>{l.close(),h()});const c=document.querySelector("dialog.info");c.querySelector("button").addEventListener("click",e=>{c.close()}),document.querySelector("main section button.info").addEventListener("click",e=>{let o=t(u.currentFeature.geometry);c.querySelector(".question").href=location.origin+location.pathname+"?lonlat="+o[0].toFixed(5)+","+o[1].toFixed(5),c.showModal()});const d=document.querySelector("aside");d.addEventListener("click",e=>{e.target===d&&e.currentTarget.classList.toggle("zoom")}),d.addEventListener("pointerout",e=>{d.classList.remove("zoom")});let m=null;const u=new class{constructor(){this.running=!1,this.startDate=Date.now(),this.endDate=null,this.time=0,this.count=0,this.totalTime=0,this.totalDist=0,this.debug=/debug/.test(location.hash),this.lonlat=location.search.replace(/^\?lonlat=([-,0-9.]*),([-,0-9.]*).*/,"$1,$2").split(",").map(parseFloat),console.log("lonlat",this.lonlat),this.timerDiv=document.querySelector("main .timer"),s(this)}ready(){console.log("Game ready"),document.body.dataset.game="ready",this.debug||this.mapAPI2.setCenter({extent:[-4.8,41.15,9.8,51.23]}),this.lonlat[0]&&this.lonlat[1]&&(this.startPosition=this.lonlat,this.debug=!0),c.querySelector(".total").innerText=this.features.length,l.querySelector("b").innerText=this.features.length,this.setDistance(0)}start(){this.running=!0,this.startDate=Date.now(),this.count++,setTimeout(()=>{this.showTime(),this.startDate=Date.now(),this.endDate=this.startDate},4e3)}stop(){this.running=!1,this.endDate=Date.now(),this.time=this.endDate-this.startDate,this.totalTime+=this.time}setDistance(e){this.totalDist+=e,c.querySelector(".found").innerText=this.count,c.querySelector(".time").innerText=n(this.totalTime),c.querySelector(".dist").innerText=a(this.totalDist)}showTime(){this.running&&(this.endDate=Date.now(),setTimeout(()=>this.showTime(),1e3)),this.timerDiv.innerHTML=n(this.endDate-this.startDate)}},p=document.querySelector(".result");function h(){var i,r;let s,l;if(delete document.body.dataset.game,p.innerHTML="",u.mapAPI2.addLayerFeatures({id:2,features:[],clear:!0}),u.mapAPI2.popup(),u.layers.forEach(e=>{u.mapAPI2.setLayer({id:e.id,visible:e.id<4})}),!u.features.length){document.body.querySelector("dialog.final .time").innerText=n(u.totalTime),document.body.querySelector("dialog.final .dist").innerText=a(u.totalDist),document.body.querySelector("dialog.final").showModal();return}let c=Math.trunc(Math.random()*u.features.length);u.debug&&(i=u.startPosition,r=u.features,s=1/0,l=0,r.forEach((e,a)=>{let n=o(i,t(e.geometry));n<s&&(l=a,s=n)}),c=l),u.currentFeature=m=u.features[c],u.features.splice(c,1),u.start(),document.querySelectorAll(".indice button").forEach((e,t)=>{let o=(m.properties["Indice "+(t+1)]||"none").split(":"),a=o[0];switch(e.className=a,e.dataset.info="",e.dataset.img=!1,e.dataset.type=a,a){case"none":break;case"zoom":case"dezoom":case"layer":case"img":o.shift(),e.dataset.info=o.join(":");break;default:e.dataset.info=o.join(":")}}),document.getElementById("map1").style.filter=m.properties.filter,u.layers.forEach(e=>{u.mapAPI1.setLayer({id:e.id,visible:e.id==m.properties.layer})}),u.mapAPI1.setCenter({extent:e(m.geometry)},()=>{u.mapAPI1.getZoom(e=>m.zoom=e)}),y()}function y(e){document.querySelector("main aside h1").innerText=m.properties.Titre||"",u.mapAPI1.getCenter(t=>{u.mapAPI1.moveTo({destination:t,rotation:parseInt(e||m.properties.orientation||0)*Math.PI/180}),setTimeout(()=>{document.body.dataset.game="searching"},2e3)})}document.querySelector("main section button.check").addEventListener("click",function(){u.stop();let e=n(u.time,!0),i=m.properties["Réponse"].split("\n");i.forEach((e,t)=>{/^#/.test(e)?i[t]="<h2>"+e.replace(/^#/,"").trim()+"</h2>":i[t]="<p>"+e.trim()+"</p>"});let s=r("DIV",{className:"info",html:i.join("\n"),parent:p});m.properties.img&&(r("IMG",{src:m.properties.img,className:"img",parent:s}),r("P",{html:m.properties.copyimg||"",className:"copy",parent:s}));let l=r("DIV",{className:"dist",parent:p});document.body.dataset.game="finish",u.mapAPI2.setLayer({id:m.properties.layer,visible:!0}),u.mapAPI2.getCenter(i=>{let n=t(m.geometry),r=o(i,n);u.mapAPI2.addLayerFeatures({id:2,features:[{type:"Feature",geometry:{type:"LineString",coordinates:[i,n]},properties:{distance:a(r)}}],clear:!0}),u.setDistance(r),u.mapAPI2.popup({position:n,content:"c'est ici !"});let s=Math.min(19-Math.log(r/1e3),m.zoom,18);u.mapAPI2.moveTo({destination:n,zoom:s,type:"flyto"});let c=0,d=33;!function t(){if(d+=33,(c+=d)>r){l.innerHTML=a(r,0)+" - "+e;return}l.innerHTML=a(c,0)+" - "+e,setTimeout(t,20)}()})}),document.querySelector("main section button.next").addEventListener("click",h),document.querySelector("main section button.coords").addEventListener("click",()=>{document.body.dataset.coords="false"===document.body.dataset.coords});const g=document.querySelector("dialog.indice");g.querySelector("button").addEventListener("click",()=>{g.close()}),document.querySelectorAll("div.indice button").forEach(e=>{e.addEventListener("click",()=>{let o=g.querySelector("div");switch(o.innerHTML="",e.dataset.type){case"img":r("IMG",{src:m.properties.img,parent:o}),r("P",{html:m.properties.copyimg,className:"img",parent:o});break;case"zoom":case"dezoom":u.mapAPI1.getZoom(e=>{if(e>m.zoom-.5){let e=t(m.geometry);u.mapAPI1.moveTo({destination:e,zoom:m.zoom-2,type:"moveTo"}),setTimeout(()=>{u.mapAPI1.moveTo({destination:e,zoom:m.zoom,type:"moveTo"})},3e3)}});return;case"layer":{let e={};u.layers.forEach(t=>{t.id==m.properties.layer&&(e=t)}),r("A",{html:"Afficher la couche : "+e.title,href:"#",parent:o}).addEventListener("click",t=>{u.mapAPI2.setLayer({id:e.id,visible:!0}),t.preventDefault(),t.stopPropagation(),g.close()});break}default:r("P",{html:"\uD83D\uDCA1 "+e.dataset.info,parent:o})}g.showModal()})}),window.doGame=h,window.showCurrent=y,window.game=u;