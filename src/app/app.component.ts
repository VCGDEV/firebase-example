import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import {FCM, NotificationData} from "@ionic-native/fcm";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              private fcm:FCM) {
    this.initializeApp();
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      //la aplicación esta lista, vamos a obtener y registrar el token en firebase
      //y procesar las notificaciones
      this.fcm.getToken()
        .then((token:string)=>{
          //aquí se debe enviar el token al backend para tenerlo registrado y de esta forma poder enviar mensajes
          // a esta  aplicación
          console.log("The token to use is: ",token);
        })
        .catch(error=>{
          //ocurrio un error al procesar el token
          console.error(error);
        });

      /**
       * No suscribimos para obtener el nuevo token cuando se realice un refresh y poder seguir procesando las notificaciones
       * */
      this.fcm.onTokenRefresh().subscribe(
        (token:string)=>console.log("Nuevo token",token),
        error=>console.error(error)
      );

      /**
       * cuando la configuración este lista vamos a procesar los mensajes
       * */
      this.fcm.onNotification().subscribe(
        (data:NotificationData)=>{
          if(data.wasTapped){
            console.log("Received in background",JSON.stringify(data))
          }else
            console.log("Received in foreground",JSON.stringify(data))
         },error=>{
          console.error("Error in notification",error)
         }
      );

      //this.fcm.subscribeToTopic("messages")
        //.then((data:any)=>console.debug(data));
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}
