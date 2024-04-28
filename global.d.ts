import { Model, ModelCtor, Sequelize } from "sequelize";
import { WpCustomPageModelInterface } from "@/lib/service/models/wp_custom_page";

export {};

declare global {
  var db: Sequelize;

  var WpCustomPageSeo: ModelCtor<any>;
  var WpCustomPage:ModelCtor<Model<WpCustomPageModelInterface>>

  interface Window {
    verificationPassed: boolean;
    onYouTubeIframeAPIReady: () => void;
    YT: any;
    Vimeo: any;
    translate: any;
    proSelBottom: boolean;
    pollGetCartTimer: NodeJS.Timer | null;
  }
}
