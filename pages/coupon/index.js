// pages/coupon/index.js

import { getCouponLoad,getCouponReceive } from "../../api/http";
import { in_array,toast } from "../../utils/util";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: [],
    page: 1,
    pageStatus: 1, // 0.隐藏 1.正在加载 2.没有更多内容 3.加载完成
    isEmpty: false,
    isLoading: true // 是否允许加载数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  onShow: function () {
    this.setData({ page: 1, result: [] });
    this.getCouponLoadData();
  },

  onReceive(event){
    let index = event.currentTarget.dataset.index;
    if(in_array(this.data.result[index].is_receive,[1,2])){
      return ;
    }

    getCouponReceive({
      id: this.data.result[index].id
    }).then(res=>{
      if(res.status){
        toast(res.info);
      }else{
        toast(res.info);
      }

      this.data.result[index].is_receive = res.data;
      this.setData({
        result: this.data.result
      });
    }).catch(err=>{
      toast("网络出错，请检查是否己连接");
    });
  },

  getCouponLoadData(){
    getCouponLoad({
      page: this.data.page
    }).then((result)=>{
      if(result.status == -1){
        if(this.data.page == 1 && result.data.list <= 0){
          this.setData({  isEmpty: true, isLoading: false,pageStatus: 0 });
        }else{
          this.setData({ isEmpty: false, isLoading: false,pageStatus: 2 });
        }
      }else if(result.status == 1){
        if(result.data.list <= 0 && this.data.page == 1){
          this.setData({ isEmpty: true, isLoading: false,pageStatus: 0 });
        }else{
          this.data.page++; 
          this.setData({
            page: this.data.page,
            isEmpty: false, 
            isLoading: true,
            pageStatus: 3,
            result: this.data.result.concat(result.data.list)
          });
        }
      }
    }).catch(error=>{
      this.setData({ isEmpty: true, isLoading: false,pageStatus: 0 });
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.isLoading === false){
      return ;
    } 

    this.setData({ pageStatus: 1 });
    this.getCouponLoadData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})