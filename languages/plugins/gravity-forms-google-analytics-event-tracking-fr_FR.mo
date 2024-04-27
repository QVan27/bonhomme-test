��    =        S   �      8     9     @  	   I  �   S     �     �       2     (   G  *   p  '   �    �  �   �  P   V  �   �     2	     ?	     N	     Z	     r	     �	  p   �	  r   �	  �   p
  �     �   �  	   Y     c  �   q  #   &  '   J     r  -   �  W   �  ,        B  g   H  
   �     �     �     �     �               )     C     T     e     t  D   |     �     �     �            �   %  B   �        L     9   b  8  �     �     �     �  �   �  
   �     �     �  O   �  7   5  ;   m  7   �  X  �  �   :  e   �  �   E     �     �     	  "        B     Z  �   q  �     �   �    ~  �   �     5     A  �   U  %   7  &   ]     �  9   �  o   �  2   K     ~  �   �  
   
  !        7     ;     X     k     �  $   �     �     �     �  
   �  R      #   W   (   {   $   �      �      �   �   �   J   �!     �!  L   "  9   Y"     -                        1   ;          '       (         .          3                 
       +       "   ,         9          !         *      :                              2          $   <   )      4          /   =   6   8         %   	   0       &   #                         7   5               Action Advanced Ajax only By default, events are sent using the measurement protocol. You can change to using pure Google Analytics and Google Tag Manager if your forms are Ajax only. Category Conditional Logic Default Enter a feed name to uniquely identify this setup. Enter your Google Analytics event action Enter your Google Analytics event category Enter your Google Analytics event label Enter your Google Analytics event value. Leave blank to omit pushing a value to Google Analytics. Or to use the purchase value of a payment based form. <strong>Note:</strong> This must be a number (int). Floating numbers (e.g., 20.95) will be rounded up (e.g., 30) Enter your Matomo (formerly Piwik) URL. This is the same URL you use to access your Matomo instance (ex. http://www.example.com/matomo/.) Enter your Site ID (ex. 2 or J2O1NDvxzmMB if using the Protect Track ID plugin.) Enter your UA code (UA-XXXX-Y) Find it <a href="https://support.google.com/analytics/answer/1032385" target="_blank">using this guide</a>. Event Action Event Category Event Label Event Tracking Settings Event UA Code Event Value Event action which you would like to send to Google Analytics using Partial Entries. Merge tags are not allowed. Event category which you would like to send to Google Analytics using Partial Entries. Merge tags are not allowed. Event label which you would like to send to Google Analytics using Partial Entries. Merge tags are not allowed. If left blank, the form value will be used. Event value (Integers only) which you would like to send to Google Analytics using Partial Entries. Merge tags are not allowed. If left blank, the form value will be used assuming it is an integer. Events will be sent using the <a target="_blank" href="https://developer.matomo.org/api-reference/tracking-api">Tracking HTTP API</a>. Feed Name Feed Settings Forms must be Ajax only. Events will be sent using the <a target="_blank" href="https://matomo.org/docs/event-tracking/#javascript-trackevent">`trackEvent` JavaScript function</a>. Google Analytics UA Code (Optional) Google Analytics and Google Tag Manager Gravity Forms Event Tracking If left blank, the following values are used: If you leave these blank, the following defaults will be used when the event is tracked JavaScript `trackEvent` Function (Ajax only) Label Leave empty to use global GA Code. You can enter multiple UA codes as long as they are comma separated. Matomo URL Measurement Protocol (Default) Name Non-interactive hits Other Settings Pagination Action Pagination Category Pagination Event Tracking Pagination Label Pagination Value Ronald Huereca Site ID This will make all your forms Ajax only for options that require it. Tracking HTTP API (Default) Turn off Interactive Hits Turn on Interactive Hits UA Tracking ID Value When conditions are enabled, events will only be sent to google when the conditions are met. When disabled, all form submissions will trigger an event. You don't have sufficient permissions to update the form settings. https://mediaron.com https://wordpress.org/plugins/gravity-forms-google-analytics-event-tracking/ {form_title}::{source_page_number}::{current_page_number} PO-Revision-Date: 2019-10-18 09:41:24+0000
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: 8bit
Plural-Forms: nplurals=2; plural=n > 1;
X-Generator: GlotPress/3.0.0-alpha.2
Language: fr
Project-Id-Version: Plugins - Event Tracking for Gravity Forms - Stable (latest release)
 Action Avancé Ajax uniquement Par défaut, les évènements sont envoyés en utilisant le protocole de mesure. Vous pouvez changer pour utiliser Google Analytics et Google Tag Manager si vos formulaires sont Ajax uniquement. Catégorie Logique conditionnelle Par défaut Saisissez un nom de flux pour identifier de manière unique cette configuration Saisissez votre action d’évènement Google Analytics Saisissez votre catégorie d’évènement Google Analytics Saisissez votre label d’évènement Google Analytics  Saisissez la valeur de votre évènement Google Analytics. Laissez vide pour omettre d'ajouter une valeur à Google Analytics. Ou pour utiliser la valeur d’achat d'un formulaire de paiement. <strong>Notification :</strong> ce doit être un nombre (int). Les nombres flottants (ex : 20,95) seront arrondis à l'unité supérieure (ex : 30). Saisissez votre URL Matomo (anciennement Piwik). C’est la même URL que vous utilisez pour accéder à votre instance Matomo (ex. http://www.example.com/matomo/). Saisissez votre ID de site (ex : 2 ou J2O1NDvxzmMB si vous utilisez l’extension Protect Track ID). Saisissez votre code UA (UA-XXXX-Y). Trouvez le <a href="https://support.google.com/analytics/answer/1032385" target="_blank">avec ce guide</a>. Action d’évènement Catégorie de l'évènement Label d’évènement Réglages de suivi d’évènement Code UA d’évènement Valeur d’évènement Action d’évènement que vous souhaitez envoyer à Google Analytics à l’aide d’entrées partielles. Les balises de fusion ne sont pas autorisées. Catégorie d’évènement que vous souhaitez envoyer à Google Analytics à l’aide d’entrées partielles. Les balises de fusion ne sont pas autorisées. Libellé d’évènement que vous souhaitez envoyer à Google Analytics à l’aide d’entrées partielles. Les balises de fusion ne sont pas autorisées. Si laissé vide, la valeur du formulaire sera utilisée. Valeur d’évènement (entiers uniquement) que vous souhaitez envoyer à Google Analytics à l’aide d’entrées partielles. Les balises de fusion ne sont pas autorisées. Si laissé vide, la valeur du formulaire sera utilisée en supposant qu’il s’agit d’un entier. Les évènements seront envoyés en utilisant la commande <a target="_blank" href="https://developer.matomo.org/api-reference/tracking-api">API HTTP de suivi</a>. Nom du flux Paramétres de flux Les formulaires doivent être en Ajax uniquement. Les évènements seront envoyés en utilisant la fonction <a target="_blank" href="https://matomo.org/docs/event-tracking/#javascript-trackevent">JavaScript `trackEvent` </a>. Code UA Google Analytics (facultatif) Google Analytics et Google Tag Manager Gravity Forms Event Tracking Si laissé vide, les valeurs suivantes sont utilisées : Si vous laissez ceci vide, les réglages suivants par défaut seront utilisés quand l’évènement est suivi. Fonction JavaScript `trackEvent' (Ajax uniquement) Libellé Laissez vide pour utiliser un code GA global. Vous pouvez saisir plusieurs codes UA tant qu’ils sont séparés par des virgules. URL Matomo Protocole de mesure (par défaut) Nom Occurrences non interactives Autres paramètres Action de pagination Catégorie de pagination Suivi des évènements de pagination Libellé de pagination Valeur de pagination Ronald Huereca ID du site Cela rendra tous vos formulaires Ajax uniquement pour les options qui l’exigent. Suivi de l’API HTTP (par défaut) Désactiver les occurrences interactives Activer les occurrences interactives ID UA de suiva Valeur Quand les conditions sont activées, les évènements seront seulement envoyés à Google quand les conditions sont remplies. Si désactivées, tous les envois de formulaire déclencheront un évènement. Vous n’avez pas les droits suffisants pour mettre à jour ces réglages. https://mediaron.com https://wordpress.org/plugins/gravity-forms-google-analytics-event-tracking/ {form_title}::{source_page_number}::{current_page_number} 