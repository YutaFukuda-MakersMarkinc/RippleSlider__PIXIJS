//国名を表示するクエリに定義
const country = document.querySelector("h2");
//ナビゲーションボタンの定義
const navigationControlRight = document.querySelector(".control-r");
const navigationControlLeft = document.querySelector(".control-l");

//PIXIの呼び出し
const Application = PIXI.Application;

//app（canvas）のサイズを指定
const app = new Application({
    width: 1920,
    height: 1080
});

//view（PIXIの変数）をappのサイズで生成
document.body.appendChild(app.view);

//PIXI内のloaderを[loader]に定義
const loader = PIXI.Loader.shared;

//[load]に画像のパスを定義
loader.add([
    './images/01.jpg',
    './images/02.jpg',
    './images/03.jpg',
    './images/04.jpg'
]).load(setup);


function setup(loader, resources){
    //Load時に変数[img1〜4]へPIXI.spriteで画像を定義する
    const img1 = PIXI.Sprite.from(
        resources['./images/01.jpg'].name
    );
    const img2 = PIXI.Sprite.from(
        resources['./images/02.jpg'].name
    );
    const img3 = PIXI.Sprite.from(
        resources['./images/03.jpg'].name
    );
    const img4 = PIXI.Sprite.from(
        resources['./images/04.jpg'].name
    );

    //画像をcanvasに対し、中央に配置する
    function centerImage(image){
        image.anchor.set(0.5);
        image.x = app.renderer.width / 2;
        image.y = app.renderer.height / 2;
    }

    centerImage(img1);
    centerImage(img2);
    centerImage(img3);
    centerImage(img4);

    //[container]をPIXIのcontainerとし、定義した[img1〜4]を逆順で投げ込む
    const container = new PIXI.Container();
    container.addChild(img4, img3, img2, img1);

    //[app]へ[container]を生成する
    app.stage.addChild(container);

    container.sortableChildren = true;

    //【重要】shockwaveFilterの導入
    const options = {
        amplitude: 300,  //300
        wavelength: 0, //160
        speed: 700, //500
        brightness: 1, //1
        radius: -1 //-1
    };

    const shockwaveFilter = new PIXI.filters.ShockwaveFilter([
        app.screen.width / 2,
        app.screen.height / 2,
    ],
    options, 0);

    container.filters = [shockwaveFilter];

    //写真・国名の表記切り替え
    let currentCountry = 1;
    let waveReady = true;
    navigationControlRight.addEventListener('click', function(){
        if((currentCountry < 4) && (waveReady === true)){
            currentCountry++;
            shockwaveFilter.wavelength = 300;
            switch(currentCountry){
                case 1:
                    country.innerHTML = 'Maldives';
                    break;
                case 2:
                    country.innerHTML = 'Turkey';
                    app.ticker.add(slide1To2);
                    break;
                case 3:
                    country.innerHTML = 'Seychelles';
                    app.ticker.add(slide2To3);
                    break;
                case 4:
                    country.innerHTML = 'Italy';
                    app.ticker.add(slide3To4);
                    break;
            }

            //slide1To2の定義
            function slide1To2(){
                startAnimation(img1, img2);
                //「shockwaveFilter」をリセットする
                if(shockwaveFilter.time > 2){
                    endAnimation(img1, img2, slide1To2);
                }
            }

            function slide2To3(){
                startAnimation(img2, img3);
                if(shockwaveFilter.time > 2){
                    endAnimation(img2, img3, slide2To3);

                }
            }
            function slide3To4(){
                startAnimation(img3, img4);
                if(shockwaveFilter.time > 2){
                    endAnimation(img3, img4, slide3To4);
                }
            }
            
        }
    })

    navigationControlLeft.addEventListener('click', function(){
        if((currentCountry > 1) && (waveReady === true)){
            currentCountry--;
            shockwaveFilter.wavelength = 300;
            switch(currentCountry){
                case 1:
                    country.innerHTML = 'Maldives';
                    app.ticker.add(slide2To1);
                    break;
                case 2:
                    country.innerHTML = 'Turkey';
                    app.ticker.add(slide3To2);
                    break;
                case 3:
                    country.innerHTML = 'Seychelles';
                    app.ticker.add(slide4To3);
                    break;
                case 4:
                    country.innerHTML = 'Italy';
                    break;
            }

            function slide4To3(){
                startAnimation(img4, img3);
                if(shockwaveFilter.time > 2){
                    endAnimation(img4, img3, slide4To3);
                }
            }

            function slide3To2(){
                startAnimation(img3, img2);
                if(shockwaveFilter.time > 2){
                    endAnimation(img3, img2, slide3To2);

                }
            }

            function slide2To1(){
                startAnimation(img2, img1);
                if(shockwaveFilter.time > 2){
                    endAnimation(img2, img1, slide2To1);

                }
            }
            
        }
    });


    //startAnimationの変数化
    function startAnimation(image1, image2){
        //「shockwaveFilter.time」に0.01を加算する（波紋の作成）
        shockwaveFilter.time += 0.01;
        //「img1.alpha」に0.008を減算する（写真の切り替え）※0.008くらいがちょうどいい
        image1.alpha -= 0.008;
        image2.alpha = 1;
        //動作が重なり挙動不審にならないよう、waveReadyをfalseにする
        waveReady = false;
    }

    //endAnimationの変数化
    function endAnimation(image1, image2, tickerCallback){
        shockwaveFilter.time = 0;
        shockwaveFilter.wavelength = 0;
        image2.zIndex = 2;
        image1.zIndex = 1;
        image1.alpha = 0;
        waveReady = true;
        app.ticker.remove(tickerCallback);
    }
}