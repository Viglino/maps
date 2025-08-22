function e(e){"Polygon"===e.type?e=e.coordinates[0]:"MultiPolygon"===e.type?e=e.coordinates[0][0]:"Point"===e.type?e=[e.coordinates]:"LineString"===e.type&&(e=e.coordinates);let t=[1/0,1/0,-1/0,-1/0];return e.forEach(e=>{(e[0]<t[0]||!t[0])&&(t[0]=e[0]),(e[1]<t[1]||!t[1])&&(t[1]=e[1]),(e[0]>t[2]||!t[2])&&(t[2]=e[0]),(e[1]>t[3]||!t[3])&&(t[3]=e[1])}),t}function t(t){let o=e(t);return[(o[0]+o[2])/2,(o[1]+o[3])/2]}function o(e,t){let o=e=>e*Math.PI/180,[a,r]=e,[n,i]=t,s=o(r),l=o(i),c=o(i-r),d=o(n-a),m=Math.sin(c/2)*Math.sin(c/2)+Math.cos(s)*Math.cos(l)*Math.sin(d/2)*Math.sin(d/2);return Math.round(2*Math.atan2(Math.sqrt(m),Math.sqrt(1-m))*6371e3)}function a(e,t){return(void 0===t&&(t=2),e>1e4)?(e/1e3).toLocaleString(void 0,{maximumFractionDigits:t})+" km":e.toLocaleString()+" m"}function r(e,t){let o=e<0?t?"O":"S":t?"E":"N",a=0|(e<0?e=-e:e),r=0|(e+=1e-9)%1*60,n=(0|60*e%1*6e3)/100;return a+"° "+(r<10?"0":"")+r+"' "+(n<10?"0":"")+n.toFixed(2)+'" '+o}function n(e,t){let o=Math.trunc((e/=1e3)/60),a=e-60*o;return t?o+"'"+(a<10?"0":"")+a.toFixed(0)+'"':o+" mn "+(a<10?"0":"")+a.toFixed(0)+" s"}function i(e,t){let o=document.createElement(e.toLowerCase());return Object.keys(t).forEach(e=>{switch(e){case"parent":t.parent.appendChild(o);break;case"html":o.innerHTML=t.html;break;default:o[e]=t[e]}}),o}function s(e){MapIFrameAPI.ready("map1",function(t){e.mapAPI1=t,t.getCenter(t=>e.startPosition=t),t.getLayers(o=>{e.layers=o,o.forEach(e=>{t.setLayer({id:e.id,visible:3===e.id})}),["zoom","mousePosition","layerSwitcher","profil","printDlg","legend","searchBar","permalink","locate"].forEach(e=>{t.mapControl({id:e,visible:!1})})}),t.getFeatures({layerId:18},t=>{e.features=t}),t.layout({css:`
      .map .ol-control.ol-permalink {
        display: none;
      }
      .map .ol-scale-line {
        left: 1em;
        right: unset;
      }
    `}),e.mapAPI2&&e.ready()}),MapIFrameAPI.ready("map2",function(t){e.mapAPI2=t,[2,14,18].forEach(e=>{t.setLayer({id:e,displayInLayerSwitcher:!1,visible:!1})}),t.addLayerFeatures({id:2,features:[],clear:!0}),t.getLayers(e=>{s.layers=e,e.forEach(e=>{t.setLayer({id:e.id,visible:e.id<4})})}),e.debug||t.setCenter({extent:[-4.8,41.15,9.8,51.23]}),t.on("move",e=>{var t;document.querySelector("section .coords").innerHTML=r((t=e.center)[0],!0)+"<br/>"+r(t[1])}),t.layout({css:`
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
      `}),e.mapAPI1&&e.ready()})}const l=document.querySelector("dialog.intro");l.showModal(),l.querySelector("button").addEventListener("click",e=>{l.close(),u()});let c=[],d=null;const m=new class{constructor(){this.running=!1,this.startDate=Date.now(),this.endDate=null,this.time=0,this.totalTime=0,this.debug=/debug/.test(location.hash),this.timerDiv=document.querySelector("main .timer"),s(this)}ready(){console.log("Game ready"),document.body.dataset.game="ready",m.debug||m.mapAPI2.setCenter({extent:[-4.8,41.15,9.8,51.23]})}start(){this.running=!0,this.startDate=Date.now(),setTimeout(()=>{this.showTime(),this.startDate=Date.now(),this.endDate=this.startDate},4e3)}stop(){this.running=!1,this.endDate=Date.now(),this.time=this.endDate-this.startDate,this.totalTime+=this.time}showTime(){this.running&&(this.endDate=Date.now(),setTimeout(()=>this.showTime(),1e3)),this.timerDiv.innerHTML=n(this.endDate-this.startDate)}},p=document.querySelector(".result");function u(){var a,r;let n,i;if(delete document.body.dataset.game,p.innerHTML="",m.mapAPI2.addLayerFeatures({id:2,features:[],clear:!0}),m.mapAPI2.popup(),c.forEach(e=>{m.mapAPI2.setLayer({id:e.id,visible:e.id<4})}),!m.features.length)return;let s=Math.trunc(Math.random()*m.features.length);m.debug&&(a=m.startPosition,r=m.features,n=1/0,i=0,r.forEach((e,r)=>{let s=o(a,t(e.geometry));s<n&&(i=r,n=s)}),s=i),console.log("ok"),d=m.features[s],m.features.splice(s,1),m.start(),document.querySelectorAll(".indice button").forEach((e,t)=>{let o=(d.properties["Indice "+(t+1)]||"none").split(":"),a=o[0];switch(e.className=a,e.dataset.info="",e.dataset.img=!1,e.dataset.type=a,a){case"none":break;case"zoom":case"dezoom":case"layer":case"img":o.shift(),e.dataset.info=o.join(":");break;default:e.dataset.info=o.join(":")}}),document.getElementById("map1").style.filter=d.properties.filter,c.forEach(e=>{m.mapAPI1.setLayer({id:e.id,visible:!1})}),m.mapAPI1.setLayer({id:d.properties.layer,visible:!0}),m.mapAPI1.setCenter({extent:e(d.geometry)},()=>{m.mapAPI1.getZoom(e=>d.zoom=e)}),h()}function h(e){document.querySelector("main aside h1").innerText=d.properties.Titre||"",m.mapAPI1.getCenter(t=>{m.mapAPI1.moveTo({destination:t,rotation:parseInt(e||d.properties.orientation||0)*Math.PI/180}),setTimeout(()=>{document.body.dataset.game="searching"},2e3)})}document.querySelector("main section button.check").addEventListener("click",function(){m.stop();let e=n(m.time,!0),r=d.properties["Réponse"].split("\n");r.forEach((e,t)=>{/^#/.test(e)?r[t]="<h2>"+e.replace(/^#/,"").trim()+"</h2>":r[t]="<p>"+e.trim()+"</p>"});let s=i("DIV",{className:"info",html:r.join("\n"),parent:p});d.properties.img&&(i("IMG",{src:d.properties.img,className:"img",parent:s}),i("P",{html:d.properties.copyimg||"",className:"copy",parent:s}));let l=i("DIV",{className:"dist",parent:p});document.body.dataset.game="finish",m.mapAPI2.setLayer({id:d.properties.layer,visible:!0}),m.mapAPI2.getCenter(r=>{let n=t(d.geometry),i=o(r,n);m.mapAPI2.addLayerFeatures({id:2,features:[{type:"Feature",geometry:{type:"LineString",coordinates:[r,n]},properties:{distance:a(i)}}],clear:!0}),m.mapAPI2.popup({position:n,content:"c'est ici !"});let s=Math.min(19-Math.log(i/1e3),d.zoom,18);m.mapAPI2.moveTo({destination:n,zoom:s,type:"flyto"});let c=0,p=33;!function t(){if(p+=33,(c+=p)>i){l.innerHTML=a(i,0)+" - "+e;return}l.innerHTML=a(c,0)+" - "+e,setTimeout(t,20)}()})}),document.querySelector("main section button.next").addEventListener("click",u),document.querySelector("main section button.coords").addEventListener("click",()=>{document.body.dataset.coords="false"===document.body.dataset.coords});const y=document.querySelector("dialog.indice");y.querySelector("button").addEventListener("click",()=>{y.close()}),document.querySelectorAll("div.indice button").forEach(e=>{e.addEventListener("click",()=>{console.log(d);let o=y.querySelector("div");switch(o.innerHTML="",console.log(e.dataset),e.dataset.type){case"img":i("IMG",{src:d.properties.img,parent:o}),i("P",{html:d.properties.copyimg,className:"img",parent:o});break;case"zoom":case"dezoom":i("BUTTON",{html:"Changer de zoom",parent:o}).addEventListener("click",()=>{m.mapAPI1.getZoom(e=>{console.log(e,d.zoom);let o=t(d.geometry);e<d.zoom-.5?m.mapAPI1.moveTo({destination:o,zoom:d.zoom,type:"moveTo"}):m.mapAPI1.moveTo({destination:o,zoom:d.zoom-2,type:"moveTo"})}),y.close()});break;case"layer":{let e={};c.forEach(t=>{t.id==d.properties.layer&&(e=t)}),i("A",{html:"Afficher la couche : "+e.title,href:"#",parent:o}).addEventListener("click",t=>{m.mapAPI2.setLayer({id:e.id,visible:!0}),t.preventDefault(),t.stopPropagation(),y.close()});break}default:i("P",{html:"\uD83D\uDCA1 "+e.dataset.info,parent:o})}y.showModal()})}),window.doGame=u,window.showCurrent=h,console.log(m);