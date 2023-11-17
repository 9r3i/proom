/**
 * proom
 * ~ picture room
 * authored by 9r3i
 * https://github.com/9r3i/proom
 * started at september 27th 2023 - v1.0.0
 * continued at november 17th 2023 - v1.1.0
 **/
const proom={
  version:'1.1.0',
  defText:null,
  answers:null,
  levelMax:null,
  stage:null,
  room:null,
  repo:null,
  ext:null,
  pswd:null,
  expire:10,
  yes:'Yes',
  no:'No',
  next:'Next',
  gallery:{},
  create:function(t,x,s){
    var d=document.createElement(t);
    d.appendTo=function(l){
      l.appendChild(this);
    };
    d.remove=function(){
      this.parentNode.removeChild(this);
    };
    d.setAttribute('style',s);
    d.innerText=x;
    return d;
  },
  main:null,
  byes:null,
  bno:null,
  bnext:null,
  toid:null,
  level:1,
  point:0,
  attempt:1,
  answer:0,
  pdiv:null,
  pbg:null,
  init:function(){
    let prep=this.create('div','Initializing...');
    prep.appendTo(document.body);
    if(typeof PROOM_GALLERY==='undefined'){
      let meta=document.querySelector('meta[name="proom:repo"]');
      if(!meta||!meta.content){
        prep.innerText='Error: Invalid repo.'
        return;
      }
      let srepo=document.createElement('script');
      srepo.src=meta.content;
      document.head.appendChild(srepo);
    }
    this.onReady(r=>{
      if(typeof PROOM_GALLERY==='undefined'){
        prep.innerText='Error: Failed to connect to "'
          +meta.content+'".';
        return;
      }
      prep.remove();
      return proom.prepare(PROOM_GALLERY);
    },prep);
  },
  onReady:function(cb,pr,i){
    cb=typeof cb==='function'?cb:function(){};
    i=i?i:0;
    if(!pr||i>=10||typeof PROOM_GALLERY!=='undefined'){
      return cb(false);
    }
    setTimeout(e=>{
      i++;
      pr.innerText='Connecting... ('+i+')';
      return proom.onReady(cb,pr,i);
    },1000);
  },
  prepare:function(data){
    /* gallery setup */
    this.gallery=typeof data.gallery!=='undefined'?data.gallery:{};
    this.room=typeof data.room!=='undefined'?data.room:'';
    this.repo=typeof data.repo!=='undefined'?data.repo:'';
    this.ext=typeof data.ext!=='undefined'?data.ext:'room';
    this.pswd=typeof data.password!=='undefined'?data.password:'';
    this.expire=typeof data.interval!=='undefined'?data.interval:10;
    this.yes=typeof data.previous!=='undefined'?data.previous:'Previous';
    this.no=typeof data.next!=='undefined'?data.next:'Next';
    this.next=typeof data.next!=='undefined'?data.next:'Next';
    /* __get request setup */
    let search=window.location.search.substr(1),
    digit=search.match(/^stage=(\d+)/);
    if(digit){
      let stage=digit?parseInt(digit[1]):0,
      gkey=(stage).toString().padStart(3,'0');
      if(!this.gallery.hasOwnProperty(gkey)){
        document.body.innerText='Error: Stage is not available.';
        return;
      }
      let gdata=this.gallery[gkey];
      /* dynamic setup */
      this.defText=gdata.title.toString();
      this.levelMax=parseInt(gdata.level);
      this.stage=stage;
    }
    /* initialize list */
    return this.initializeList();
  },
  initializeList:function(){
    if(window.location.search.substr(1).match(/^stage=\d+/)){
      /* body style setup */
      document.body.style.margin='0px';
      document.body.style.padding='0px';
      document.body.style.backgroundColor='#000';
      document.body.style.color='#fff';
      /* initialize */
      return this.initialize();
    }
    document.body.style.overflow='auto';
    let prep=this.create('div','','padding:20px;'),
    ufirst=false;
    prep.appendTo(document.body);
    for(let key in this.gallery){
      let gkey=parseInt(key),
      gfirst=ufirst?false:true,
      gdata=this.gallery[key],
      gline=this.create('div','['+key+'] '+gdata.title,this.styleList(gfirst));
      gline.appendTo(prep);
      gline.dataset.key=gkey.toString();
      gline.onclick=function(e){
        window.location.assign('?stage='+this.dataset.key);
      };
      gline.ontouchstart=function(e){
        this.style.backgroundColor='#eed';
      };
      gline.ontouchend=function(e){
        this.style.backgroundColor='#fff';
      };
      if(gfirst){
        ufirst=true;
      }
    }
  },
  initialize:function(){
    document.body.style.overflow='hidden';
    this.main=this.create('div',null,this.style());
    this.main.appendTo(document.body);
    this.main.onclick=e=>{
      proom.main.style.transform='scale(2)';
      setTimeout(()=>{
        proom.main.style.transform='scale(1)';
      },1500);
    };
    this.byes=this.create('div',this.yes,this.styleButtonYes());
    this.bno=this.create('div',this.no,this.styleButtonNo());
    this.bnext=this.create('div',this.next,this.styleButtonNext());
    this.byes.appendTo(document.body);
    this.bno.appendTo(document.body);
    this.bnext.appendTo(document.body);
    this.byes.onclick=e=>{
      return proom.done(1);
    };
    this.bno.onclick=e=>{
      return proom.done(0);
    };
    this.bnext.onclick=e=>{
      this.level+=1;
      return proom.start();
    };
    this.pbg=this.create('div',null,this.stylePointBG());
    this.pbg.appendTo(document.body);
    this.pdiv=this.create('div',null,this.stylePoint());
    this.pdiv.appendTo(document.body);
    return this.start();
  },
  levelURL:function(add=0){
    add=add%1===0?add:0;
    let room=this.room===''?''
      :this.room+'?pswd='+this.pswd+'&url=';
    return room+this.repo+'stage.'
      +this.stage.toString().padStart(3,'0')+'/'
      +'level.'
      +(this.level+add).toString().padStart(3,'0')+'.'
      +this.ext;
  },
  start:function(){
    this.main.style.removeProperty('background-image');
    this.main.style.color='#fff';
    this.main.style.textShadow='0px 0px 15px #000';
    this.main.innerText='Loading...';
    this.bnext.style.left='-100vw';
    this.byes.style.left='-100vw';
    this.bno.style.right='-100vw';
    if(this.level>this.levelMax){
      this.level=1;
    }else if(this.level<1){
      this.level=this.levelMax;
    }
    let add=this.level==this.levelMax
      ?-(this.levelMax-1):1;
    let url=this.levelURL();
    let url2=this.levelURL(1);
    let img=new Image;
    let img2=new Image;
    img.src=url;
    img2.src=url2;
    img.onload=function(){
      proom.score();
      proom.main.style.backgroundImage='url(\''+url+'\')';
      proom.byes.style.left='20px';
      proom.bno.style.right='20px';
      return proom.countdown();
    };
    img.onerror=function(){
      proom.main.innerText='Error: Failed to load image. ';
      setTimeout(e=>{
        return proom.start();
      },5000);
    };
  },
  countdown:function(i){
    i=typeof i==='number'?i:this.expire;
    let text=this.defText
      +'\n'+i+' second'+(i>1?'s':''),
    counter=this.create('div',text,this.styleCountdown());
    this.main.innerText='';
    counter.appendTo(this.main);
    if(i<1){return this.done();}
    this.toid=setTimeout(e=>{
      i--;
      return proom.countdown(i);
    },1000);
  },
  done:function(c){
    clearTimeout(this.toid);
    this.byes.style.left='-100vw';
    this.bno.style.right='-100vw';
    if(this.level<this.levelMax){
      this.bnext.style.left='20px';
    }
    this.main.innerText='';
    if(typeof c==='undefined'){
      this.level+=1;
      return this.start();
    }
    if(c==1){
      this.level-=1;
      return this.start();
    }else{
      this.level+=1;
      return this.start();
    }
    this.score();
    this.main.style.backgroundImage='url('+this.levelURL()+')';
    setTimeout(e=>{
      this.main.style.color='transparent';
      this.main.style.textShadow='none';
    },1000);
    return;
  },
  score:function(){
    this.pdiv.innerText='Score: '
      +Math.floor((this.point/this.level)*100)
      +'\nPoint: '+this.point
      +'\nLevel: '+this.level+'/'+this.levelMax;
  },
  reset:function(){
    if(typeof _basic!=='undefined'){
      _basic.abl.database(false);
    }return window.location.reload();
  },
  styleList:function(u){
    return 'display:block;'
      +'font-family:system-ui;font-size:16px;'
      +'padding:20px 10px 20px 10px;'
      +'border-bottom:1px solid #bbb;'
      +(u?'border-top:1px solid #bbb;':'')
      +'';
  },
  styleCountdown:function(){
    return 'display:block;position:fixed;z-index:1001;'
      +'right:0px;top:0px;text-align:right;'
      +'padding:10px 20px 10px 50px;'
      +'border-radius:0px 0px 0px 50px;'
      +'font-family:system-ui;'
      +'background-color:rgb(0,0,0,0.3);';
  },
  stylePointBG:function(){
    return 'display:flex;height:70px;width:100px;'
      +'align-items:center;justify-content:left;'
      +'background-color:#333;margin:0px;padding:10px;'
      +'position:fixed;z-index:1000;top:0px;left:0px;'
      +'overflow:hidden;color:#fff;'
      +'border-radius:0px 0px 150px 0px;'
      +'box-shadow:0px 0px 15px #000;'
      +'font-family:system-ui,monospace;font-size:13px;'
      +'opacity:0.4;transition:all 3s ease 0s;'
      +'text-shadow:0px 0px 15px #000;user-select:none;'
      +'white-space:pre-wrap;text-align:left;';
  },
  stylePoint:function(){
    return 'display:flex;height:auto;width:100vw;'
      +'align-items:center;justify-content:left;'
      +'background-color:tranparent;margin:0px;padding:10px;'
      +'background-size:cover;background-position:center;'
      +'position:fixed;z-index:1001;top:0px;left:0px;'
      +'right:0px;overflow:hidden;color:#fff;'
      +'font-family:system-ui,monospace;font-size:13px;'
      +'opacity:1;transition:all 3s ease 0s;'
      +'text-shadow:0px 0px 15px #000;user-select:none;'
      +'white-space:pre-wrap;text-align:left;';
  },
  styleButtonNext:function(){
    return 'background-color:#b37;color:#fff;'
      +'padding:10px 30px;margin:0px;'
      +'left:-100vw;bottom:20px;'
      +'position:fixed;z-index:1000;'
      +'font-family:system-ui,monospace;font-size:20px;'
      +'opacity:1;transition:all 1s ease 0s;'
      +'text-shadow:0px 0px 5px #000;user-select:none;'
      +'box-shadow:0px 0px 5px #333;'
      +'white-space:pre-wrap;text-align:center;'
      +'border:0px none;border-radius:10px;';
  },
  styleButtonNo:function(){
    return 'background-color:#3b7;color:#fff;'
      +'padding:10px 35px;margin:0px;'
      +'right:20px;bottom:20px;'
      +'position:fixed;z-index:1000;'
      +'font-family:system-ui,monospace;font-size:20px;'
      +'opacity:1;transition:all 1s ease 0s;'
      +'text-shadow:0px 0px 5px #000;user-select:none;'
      +'box-shadow:0px 0px 5px #333;'
      +'white-space:pre-wrap;text-align:center;'
      +'border:0px none;border-radius:10px;';
  },
  styleButtonYes:function(){
    return 'background-color:#37b;color:#fff;'
      +'padding:10px 35px;margin:0px;'
      +'left:20px;bottom:20px;'
      +'position:fixed;z-index:1000;'
      +'font-family:system-ui,monospace;font-size:20px;'
      +'opacity:1;transition:all 1s ease 0s;'
      +'text-shadow:0px 0px 5px #000;user-select:none;'
      +'box-shadow:0px 0px 5px #333;'
      +'white-space:pre-wrap;text-align:center;'
      +'border:0px none;border-radius:10px;';
  },
  style:function(){
    let wh=window.innerHeight,
    ww=window.innerWidth,
    bs=wh>ww?'100% auto':'auto 100%';
    return 'display:flex;height:100vh;width:100vw;'
      +'align-items:center;justify-content:center;'
      +'background-color:tranparent;margin:0px;padding:0px;'
      +'background-size:'+bs+';background-position:center;'
      +'background-repeat:no-repeat;'
      +'position:fixed;z-index:999;top:0px;left:0px;'
      +'right:0px;bottom:0px;overflow:hidden;color:#fff;'
      +'font-family:system-ui,monospace;font-size:13px;'
      +'opacity:1;transition:all 3s ease 0s;'
      +'text-shadow:0px 0px 15px #000;user-select:none;'
      +'white-space:pre-wrap;text-align:center;';
  }
};
