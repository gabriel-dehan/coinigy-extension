(function(c){var e=10;var a=0.95;function d(w){var h=null,B=null,i=null,n=null,t=null,o=null,f=false,v=null;var j=[];w.hooks.processOptions.push(function(D,C){if(C.series.pie.show){C.grid.show=false;if(C.series.pie.label.show=="auto"){if(C.legend.show){C.series.pie.label.show=false}else{C.series.pie.label.show=true}}if(C.series.pie.radius=="auto"){if(C.series.pie.label.show){C.series.pie.radius=3/4}else{C.series.pie.radius=1}}if(C.series.pie.tilt>1){C.series.pie.tilt=1}else{if(C.series.pie.tilt<0){C.series.pie.tilt=0}}}});w.hooks.bindEvents.push(function(E,C){var D=E.getOptions();if(D.series.pie.show){if(D.grid.hoverable){C.unbind("mousemove").mousemove(s)}if(D.grid.clickable){C.unbind("click").click(l)}}});w.hooks.processDatapoints.push(function(G,D,E,F){var C=G.getOptions();if(C.series.pie.show){x(G,D,E,F)}});w.hooks.drawOverlay.push(function(D,E){var C=D.getOptions();if(C.series.pie.show){y(D,E)}});w.hooks.draw.push(function(E,D){var C=E.getOptions();if(C.series.pie.show){p(E,D)}});function x(E,C,D){if(!f){f=true;h=E.getCanvas();B=c(h).parent();i=E.getOptions();E.setData(A(E.getData()))}}function A(H){var F=0,E=0,J=0,C=i.series.pie.combine.color,I=[];for(var D=0;D<H.length;++D){var G=H[D].data;if(c.isArray(G)&&G.length==1){G=G[0]}if(c.isArray(G)){if(!isNaN(parseFloat(G[1]))&&isFinite(G[1])){G[1]=+G[1]}else{G[1]=0}}else{if(!isNaN(parseFloat(G))&&isFinite(G)){G=[1,+G]}else{G=[1,0]}}H[D].data=[G]}for(var D=0;D<H.length;++D){F+=H[D].data[0][1]}for(var D=0;D<H.length;++D){var G=H[D].data[0][1];if(G/F<=i.series.pie.combine.threshold){E+=G;J++;if(!C){C=H[D].color}}}for(var D=0;D<H.length;++D){var G=H[D].data[0][1];if(J<2||G/F>i.series.pie.combine.threshold){I.push({data:[[1,G]],color:H[D].color,label:H[D].label,angle:G*Math.PI*2/F,percent:G/(F/100)})}}if(J>1){I.push({data:[[1,E]],color:C,label:i.series.pie.combine.label,angle:E*Math.PI*2/F,percent:E/(F/100)})}return I}function p(H,K){if(!B){return}var D=H.getPlaceholder().width(),F=H.getPlaceholder().height(),J=B.children().filter(".legend").children().width()||0;v=K;f=false;n=Math.min(D,F/i.series.pie.tilt)/2;o=F/2+i.series.pie.offset.top;t=D/2;if(i.series.pie.offset.left=="auto"){if(i.legend.position.match("w")){t+=J/2}else{t-=J/2}if(t<n){t=n}else{if(t>D-n){t=D-n}}}else{t+=i.series.pie.offset.left}var I=H.getData(),L=0;do{if(L>0){n*=a}L+=1;G();if(i.series.pie.tilt<=0.8){E()}}while(!C()&&L<e);if(L>=e){G();B.prepend("<div class='error'>Could not draw pie with labels contained inside canvas</div>")}if(H.setSeries&&H.insertLegend){H.setSeries(I);H.insertLegend()}function G(){v.clearRect(0,0,D,F);B.children().filter(".pieLabel, .pieLabelBackground").remove()}function E(){var R=i.series.pie.shadow.left;var Q=i.series.pie.shadow.top;var O=10;var P=i.series.pie.shadow.alpha;var M=i.series.pie.radius>1?i.series.pie.radius:n*i.series.pie.radius;if(M>=D/2-R||M*i.series.pie.tilt>=F/2-Q||M<=O){return}v.save();v.translate(R,Q);v.globalAlpha=P;v.fillStyle="#000";v.translate(t,o);v.scale(1,i.series.pie.tilt);for(var N=1;N<=O;N++){v.beginPath();v.arc(0,0,M,0,Math.PI*2,false);v.fill();M-=N}v.restore()}function C(){var P=Math.PI*i.series.pie.startAngle;var M=i.series.pie.radius>1?i.series.pie.radius:n*i.series.pie.radius;v.save();v.translate(t,o);v.scale(1,i.series.pie.tilt);v.save();var S=P;for(var O=0;O<I.length;++O){I[O].startAngle=S;R(I[O].angle,I[O].color,true)}v.restore();if(i.series.pie.stroke.width>0){v.save();v.lineWidth=i.series.pie.stroke.width;S=P;for(var O=0;O<I.length;++O){R(I[O].angle,i.series.pie.stroke.color,false)}v.restore()}z(v);v.restore();if(i.series.pie.label.show){return N()}else{return true}function Q(ac,T,aa,U,X){if(typeof ac==="string"){return ac}else{if((ac===null)||(ac.colors===null)){return U}else{var ab;if(X){ab=v.createRadialGradient(0,0,0,0,0,X)}else{ab=v.createLinearGradient(0,aa,0,T)}for(var W=0,V=ac.colors.length;W<V;++W){var Y=ac.colors[W];if(typeof Y!=="string"){var Z=c.color.parse(U);if(Y.brightness!=null){Z=Z.scale("rgb",Y.brightness)}if(Y.opacity!=null){Z.a*=Y.opacity}Y=Z.toString()}ab.addColorStop(W/(V-1),Y)}return ab}}}function R(V,T,U){if(V<=0||isNaN(V)){return}if(U){v.fillStyle=Q(i.series.pie.gradient,H.height(),0,T,i.series.pie.gradient.radial&&M)}else{v.strokeStyle=T;v.lineJoin="round"}v.beginPath();if(Math.abs(V-Math.PI*2)>1e-9){v.moveTo(0,0)}v.arc(0,0,M,S,S+V/2,false);v.arc(0,0,M,S+V/2,S+V,false);v.closePath();S+=V;if(U){v.fill()}else{v.stroke()}}function N(){var W=P;var T=i.series.pie.label.radius>1?i.series.pie.label.radius:n*i.series.pie.label.radius;for(var V=0;V<I.length;++V){if(I[V].percent>=i.series.pie.label.threshold*100){if(!U(I[V],W,V)){return false}}W+=I[V].angle}return true;function U(aj,ac,aa){if(aj.data[0][1]==0){return true}var al=i.legend.labelFormatter,ak,Y=i.series.pie.label.formatter;if(al){ak=al(aj.label,aj)}else{ak=aj.label}if(Y){ak=Y(ak,aj)}var ad=((ac+aj.angle)+ac)/2;var ai=t+Math.round(Math.cos(ad)*T);var ag=o+Math.round(Math.sin(ad)*T)*i.series.pie.tilt;var Z="<span class='pieLabel' id='pieLabel"+aa+"' style='position:absolute;top:"+ag+"px;left:"+ai+"px;'>"+ak+"</span>";B.append(Z);var ah=B.children("#pieLabel"+aa);var X=(ag-ah.height()/2);var ab=(ai-ah.width()/2);ah.css("top",X);ah.css("left",ab);if(0-X>0||0-ab>0||F-(X+ah.height())<0||D-(ab+ah.width())<0){return false}if(i.series.pie.label.background.opacity!=0){var ae=i.series.pie.label.background.color;if(ae==null){ae=aj.color}var af="top:"+X+"px;left:"+ab+"px;";c("<div class='pieLabelBackground' style='position:absolute;width:"+ah.width()+"px;height:"+ah.height()+"px;"+af+"background-color:"+ae+";'></div>").css("opacity",i.series.pie.label.background.opacity).insertBefore(ah)}return true}}}}function z(C){if(i.series.pie.innerRadius>0){C.save();var D=i.series.pie.innerRadius>1?i.series.pie.innerRadius:n*i.series.pie.innerRadius;C.globalCompositeOperation="destination-out";C.beginPath();C.fillStyle=i.series.pie.stroke.color;C.arc(0,0,D,0,Math.PI*2,false);C.fill();C.closePath();C.restore();C.save();C.beginPath();C.strokeStyle=i.series.pie.stroke.color;C.arc(0,0,D,0,Math.PI*2,false);C.stroke();C.closePath();C.restore()}}function q(F,G){for(var H=false,E=-1,C=F.length,D=C-1;++E<C;D=E){((F[E][1]<=G[1]&&G[1]<F[D][1])||(F[D][1]<=G[1]&&G[1]<F[E][1]))&&(G[0]<(F[D][0]-F[E][0])*(G[1]-F[E][1])/(F[D][1]-F[E][1])+F[E][0])&&(H=!H)}return H}function r(K,J){var E=w.getData(),H=w.getOptions(),I=H.series.pie.radius>1?H.series.pie.radius:n*H.series.pie.radius,N,L;for(var U=0;U<E.length;++U){var Q=E[U];if(Q.pie.show){v.save();v.beginPath();v.moveTo(0,0);v.arc(0,0,I,Q.startAngle,Q.startAngle+Q.angle/2,false);v.arc(0,0,I,Q.startAngle+Q.angle/2,Q.startAngle+Q.angle,false);v.closePath();N=K-t;L=J-o;if(v.isPointInPath){if(v.isPointInPath(K-t,J-o)){v.restore();return{datapoint:[Q.percent,Q.data],dataIndex:0,series:Q,seriesIndex:U}}}else{var T=I*Math.cos(Q.startAngle),S=I*Math.sin(Q.startAngle),F=I*Math.cos(Q.startAngle+Q.angle/4),C=I*Math.sin(Q.startAngle+Q.angle/4),O=I*Math.cos(Q.startAngle+Q.angle/2),M=I*Math.sin(Q.startAngle+Q.angle/2),W=I*Math.cos(Q.startAngle+Q.angle/1.5),V=I*Math.sin(Q.startAngle+Q.angle/1.5),G=I*Math.cos(Q.startAngle+Q.angle),D=I*Math.sin(Q.startAngle+Q.angle),R=[[0,0],[T,S],[F,C],[O,M],[W,V],[G,D]],P=[N,L];if(q(R,P)){v.restore();return{datapoint:[Q.percent,Q.data],dataIndex:0,series:Q,seriesIndex:U}}}v.restore()}}return null}function s(C){m("plothover",C)}function l(C){m("plotclick",C)}function m(C,I){var D=w.offset();var G=parseInt(I.pageX-D.left);var E=parseInt(I.pageY-D.top);var K=r(G,E);if(i.grid.autoHighlight){for(var F=0;F<j.length;++F){var H=j[F];if(H.auto==C&&!(K&&H.series==K.series)){g(H.series)}}}if(K){k(K.series,C)}var J={pageX:I.pageX,pageY:I.pageY};B.trigger(C,[J,K])}function k(D,E){var C=u(D);if(C==-1){j.push({series:D,auto:E});w.triggerRedrawOverlay()}else{if(!E){j[C].auto=false}}}function g(D){if(D==null){j=[];w.triggerRedrawOverlay()}var C=u(D);if(C!=-1){j.splice(C,1);w.triggerRedrawOverlay()}}function u(E){for(var C=0;C<j.length;++C){var D=j[C];if(D.series==E){return C}}return -1}function y(G,H){var E=G.getOptions();var C=E.series.pie.radius>1?E.series.pie.radius:n*E.series.pie.radius;H.save();H.translate(t,o);H.scale(1,E.series.pie.tilt);for(var F=0;F<j.length;++F){D(j[F].series)}z(H);H.restore();function D(I){if(I.angle<=0||isNaN(I.angle)){return}H.fillStyle="rgba(255, 255, 255, "+E.series.pie.highlight.opacity+")";H.beginPath();if(Math.abs(I.angle-Math.PI*2)>1e-9){H.moveTo(0,0)}H.arc(0,0,C,I.startAngle,I.startAngle+I.angle/2,false);H.arc(0,0,C,I.startAngle+I.angle/2,I.startAngle+I.angle,false);H.closePath();H.fill()}}}var b={series:{pie:{show:false,radius:"auto",innerRadius:0,startAngle:3/2,tilt:1,shadow:{left:5,top:15,alpha:0.02},offset:{top:0,left:"auto"},stroke:{color:"rgba(255,255,255,0.1)",width:1},label:{show:"auto",formatter:function(f,g){return"<div style='font-size:x-small;text-align:center;padding:2px;color:"+g.color+";'>"+f+"<br/>"+Math.round(g.percent)+"%</div>"},radius:1,background:{color:null,opacity:0},threshold:0},combine:{threshold:-1,color:null,label:"Other"},highlight:{opacity:0.5},gradient:{radial:true,colors:null}}}};c.plot.plugins.push({init:d,options:b,name:"pie",version:"1.1"})})(jQuery);