import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

export default class App extends Component {
  curP = 7; //当前的页数                     参数
  url = 'https://api.apiopen.top/getImages?page=';
  state = {result: [], zhuantai: false};
  // 声明周期  挂载时       ↑表示下拉刷新的状态
  componentDidMount() {
    // 请求首个res  是返回的所有内容 调用json才能得到返回值的数据部分
    fetch(this.url + this.curP)
      .then((res) => res.json())
      .then((res) => {
        this.setState({result: res.result});
      });
  }

  render() {
    return (
      <FlatList
        data={this.state.result}
        keyExtractor={(item, index) => index + ''}
        renderItem={this._renderItem}
        numColumns={2}
        // ItemSeparatorComponent={this._ItemSeparatorComponent}
        ListFooterComponent={this._ListFooterComponent}
        onEndReached={this._onEndReached}
        // 预触底加载
        onEndReachedThreshold={0.1}
        //下拉刷新
        onRefresh={this._onRefresh}
        // 是否显示下拉刷新的状态
        refreshing={this.state.zhuantai}
      />
    );
  }
  //下拉刷新
  _onRefresh = () => {
    this.setState({zhuantai: true});
    fetch(this.url + 7)
      .then((res) => res.json())
      .then((res) => {
        this.setState({result: res.result, zhuantai: false}); //停止刷新状态
      });
  };
  // 触底
  _onEndReached = () => {
    let nexp = this.curP + 1;
    fetch(this.url + nexp)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        this.setState({result: this.state.result.concat(res.result)});
        this.curP = nexp;
      });
  };
  // 底部加载
  _ListFooterComponent = () => {
    return (
      <View>
        <ActivityIndicator color="blue" size="large" />
        <Text style={{fontSize: 30}}>加载中...</Text>
      </View>
    );
  };
  _ItemSeparatorComponent = () => {
    // return <View style={{backgroundColor: 'black', height: 4}}></View>;
  };

  _renderItem = ({item}) => {
    const {width, height} = Dimensions.get('screen');
    function rpx(p) {
      return (width / 750) * p;
    }
    return (
      <View style={{width: width / 2 - 60, height: height / 3, margin: 20}}>
        <Image
          source={{uri: item.img}}
          style={{
            width: '100%',
            height: '100%',
            marginRight: 20,
            marginLeft: 20,
          }}
        />
      </View>
    );
  };
}
const styles = StyleSheet.create({});
