import { DataTypes } from "sequelize";
import seq from "../db/seq";
import WpPostMeta from "./wp_postmeta.model";

const tableName = "wp_posts";

const WpPosts = seq().define<any>(tableName, {
  ID: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  post_author: {
    type: DataTypes.BIGINT
  },
  post_date: {
    type: DataTypes.DATE
  },
  post_date_gmt: {
    type: DataTypes.DATE
  },
  post_content: {
    type: DataTypes.TEXT
  },
  post_title: {
    type: DataTypes.TEXT
  },
  post_excerpt: {
    type: DataTypes.TEXT
  },
  post_status: {
    type: DataTypes.STRING
  },
  comment_status: {
    type: DataTypes.STRING
  },
  ping_status: {
    type: DataTypes.STRING
  },
  post_password: {
    type: DataTypes.STRING
  },
  post_name: {
    type: DataTypes.STRING
  },
  to_ping: {
    type: DataTypes.TEXT
  },
  pinged: {
    type: DataTypes.TEXT
  },
  post_modified: {
    type: DataTypes.DATE
  },
  post_modified_gmt: {
    type: DataTypes.DATE
  },
  post_content_filtered: {
    type: DataTypes.TEXT
  },
  post_parent: {
    type: DataTypes.BIGINT
  },
  guid: {
    type: DataTypes.STRING
  },
  menu_order: {
    type: DataTypes.INTEGER
  },
  post_type: {
    type: DataTypes.STRING
  },
  post_mime_type: {
    type: DataTypes.STRING
  },
  comment_count: {
    type: DataTypes.BIGINT
  }
}, {
  tableName: tableName,
  timestamps: false
});
WpPosts.hasMany(WpPostMeta, {
  foreignKey: "post_id",
  as: "metas"
});
WpPostMeta.belongsTo(WpPosts, {
  foreignKey: "post_id",
  as: "post"
});
WpPosts.sync({ force: false }).then(r => {
  console.log("创建posts表成功");
}).catch(e => {
  console.log("创建posts表失败", e);
});


export default WpPosts;
