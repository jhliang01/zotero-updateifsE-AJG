import { ProgressWindowHelper } from "zotero-plugin-toolkit/dist/helpers/progressWindow";
import { config } from "../../package.json";
import { getString } from "./locale";
import { njauCore, njauJournal } from "./njau";

function example(
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value;
  descriptor.value = function (...args: any) {
    try {
      ztoolkit.log(`Calling example ${target.name}.${String(propertyKey)}`);
      return original.apply(this, args);
    } catch (e) {
      ztoolkit.log(`Error in example ${target.name}.${String(propertyKey)}`, e);
      throw e;
    }
  };
  return descriptor;
}

export class BasicExampleFactory {
  @example
  static registerNotifier() {
    const callback = {
      notify: async (
        event: string,
        type: string,
        ids: Array<string | number>,
        extraData: { [key: string]: any }
      ) => {
        if (!addon?.data.alive) {
          this.unregisterNotifier(notifierID);
          return;
        }
        addon.hooks.onNotify(event, type, ids, extraData);
        // 增加条目时
        // Zotero.Items.get(ids).filter(item => item.isRegularItem())
      },
    };

    // Register the callback in Zotero as an item observer

    const notifierID = Zotero.Notifier.registerObserver(callback, [
      "tab",
      "item",
      "file",
    ]);

    // Unregister callback when the window closes (important to avoid a memory leak)
    window.addEventListener(
      "unload",
      (e: Event) => {
        this.unregisterNotifier(notifierID);
      },
      false
    );
  }

  @example
  static async exampleNotifierCallback(ids: any) {
    // 增加条目时 新增条目时
    //  Zotero.Items.get(ids).filter(item => item.isRegularItem())
    var items = Zotero.Items.get(ids);
    // 增加条目时 更新
    var addUpdate = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.add.update`, true);
    if (addUpdate) {
      await KeyExampleFactory.setExtra(items);
    }
    // 得到添加的条目总数
    // var items = Zotero.Items.get(ids);
    // Zotero.debug(`ccc添加条目了${ids}！`)
    // HelperExampleFactory.progressWindow(ids, "success");

    // HelperExampleFactory.progressWindow('ccc添加条目了${title}！', "success");
    // try {
    //   var items = Zotero.Items.get(ids);
    //   var item = items[0];
    //   var title = item.getField('title');
    //   HelperExampleFactory.progressWindow(`ccc添加条目了${title}！`, "success");
    // } catch (error) {
    //   Zotero.debug(error)
    // }
  }

  @example
  private static unregisterNotifier(notifierID: string) {
    Zotero.Notifier.unregisterObserver(notifierID);
  }

  @example
  static registerPrefs() {
    const prefOptions = {
      pluginID: config.addonID,
      src: rootURI + "chrome/content/preferences.xhtml",
      label: getString("prefs.title"),
      image: `chrome://${config.addonRef}/content/icons/favicon.png`,
      extraDTD: [`chrome://${config.addonRef}/locale/overlay.dtd`],
      defaultXUL: true,
    };
    ztoolkit.PreferencePane.register(prefOptions);
  }
}

export class KeyExampleFactory {
  //得到所选条目
  @example
  static getSelectedItems() {
    var items = Zotero.getActiveZoteroPane().getSelectedItems();
    return items;
  }
  //分类右击更新信息
  @example
  static async setExtraCol() {
    var collection = ZoteroPane.getSelectedCollection();
    var items = collection?.getChildItems();
    await KeyExampleFactory.setExtra(items);
  }
  //条目右键更新信息 右键菜单执行函数
  @example
  static async setExtraItems() {
    var secretKey: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.secretkey`, true);

    if (secretKey) {
      var items = Zotero.getActiveZoteroPane().getSelectedItems();
      await KeyExampleFactory.setExtra(items);
    } else {
      var alertInfo = getString('inputSecretkey');
      HelperExampleFactory.progressWindow(alertInfo, 'fail');

    }

  }
  @example
  static async setExtra(items: any) {
    var n = 0;
    for (let item of items) {
      if (UIExampleFactory.checkItem(item)) {  //如果是期刊才继续
        var easyscholarData = await KeyExampleFactory.getIFs(item); //得到easyscholar数据
        var chineseIFs = await KeyExampleFactory.getChineseIFs(item); //综合影响因子、复合影响因子


        // 加: any为了后面不报错
        var jcr: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.jcr.qu`, true);
        var basic: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.basic`, true);
        var updated: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.updated`, true);
        var ifs: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.sci.if`, true);
        var if5: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.sci.if5`, true);
        var eii: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.ei`, true);
        var chjcscd: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.chjcscd`, true);
        var pkucore: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.pku.core`, true);
        var njucore: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.nju.core`, true);
        var scicore: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.sci.core`, true);
        var ssci: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.ssci`, true);
        var ajg: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.ajg`, true);
        var utd24: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.utd24`, true);
        var ft50: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.ft50`, true);
        var ccf: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.ccf`, true);
        var fms: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.fms`, true);
        var jci: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.jci`, true);
        var ahci: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.ahci`, true);
        var compoundIFs: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.com.if`, true);
        var comprehensiveIFs: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.agg.if`, true);
        var njauCoreShow = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.njau.core`, true);
        var njauJourShow = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.njau.high.quality`, true);

        if (easyscholarData) { //如果得到easyscholar数据再写入
          // HelperExampleFactory.progressWindow(easyscholarData['sci'], 'success')
          if (jcr && easyscholarData['sci']) {
            ztoolkit.ExtraField.setExtraField(item, 'JCR分区', easyscholarData['sci']);
          }
          if (updated && easyscholarData['sciUp']) {
            ztoolkit.ExtraField.setExtraField(item, '中科院分区升级版', easyscholarData['sciUp']);
          }
          if (basic && easyscholarData['sciBase']) {
            ztoolkit.ExtraField.setExtraField(item, '中科院分区基础版', easyscholarData['sciBase']);
          }
          if (ifs && easyscholarData['sciif']) {
            ztoolkit.ExtraField.setExtraField(item, '影响因子', easyscholarData['sciif']);
          }
          if (if5 && easyscholarData['sciif5']) {
            ztoolkit.ExtraField.setExtraField(item, '5年影响因子', easyscholarData['sciif5']);
          }
          if (eii && easyscholarData['eii']) {
            ztoolkit.ExtraField.setExtraField(item, 'EI', '是');
          }
          if (chjcscd && easyscholarData['cscd']) {
            ztoolkit.ExtraField.setExtraField(item, 'CSCD', easyscholarData['cscd']);
          }
          if (pkucore && easyscholarData['pku']) {
            ztoolkit.ExtraField.setExtraField(item, '中文核心期刊/北大核心', '是');
          }
          if (njucore && easyscholarData['cssci']) {
            ztoolkit.ExtraField.setExtraField(item, 'CSSCI/南大核心', '是');
          }
          if (scicore && easyscholarData['zhongguokejihexin']) {
            ztoolkit.ExtraField.setExtraField(item, '中国科技核心期刊', '是');
          }
          if (ssci && easyscholarData['ssci']) {
            ztoolkit.ExtraField.setExtraField(item, 'SSCI', easyscholarData['ssci']);
          }
          if (ajg && easyscholarData['ajg']) {
            ztoolkit.ExtraField.setExtraField(item, 'AJG', easyscholarData['ajg']);
          }
          if (utd24 && easyscholarData['utd24']) {
            ztoolkit.ExtraField.setExtraField(item, 'UTD24', easyscholarData['utd24']);
          }
          if (ft50 && easyscholarData['ft50']) {
            ztoolkit.ExtraField.setExtraField(item, 'FT50', easyscholarData['ft50']);
          }
          if (ccf && easyscholarData['ccf']) {
            ztoolkit.ExtraField.setExtraField(item, 'CCF', easyscholarData['ccf']);
          }
          if (fms && easyscholarData['fms']) {
            ztoolkit.ExtraField.setExtraField(item, 'FMS', easyscholarData['fms']);
          }
          if (jci && easyscholarData['jci']) {
            ztoolkit.ExtraField.setExtraField(item, 'JCI', easyscholarData['jci']);
          }
          if (ahci && easyscholarData['ahci']) {
            ztoolkit.ExtraField.setExtraField(item, 'AHCI', easyscholarData['ahci']);
          }
        }
        //复合影响因子、综合影响因子
        if (chineseIFs) { // 如果得到复合影响因子、综合影响因子再写入
          // if (!chineseIFs) { return } // 否则后面会报错
          if (compoundIFs) {
            ztoolkit.ExtraField.setExtraField(item, '复合影响因子', chineseIFs[0]);
          }
          if (comprehensiveIFs) {
            ztoolkit.ExtraField.setExtraField(item, '综合影响因子', chineseIFs[1]);
          }
        }
        // 南农核心期刊分类、高水平期刊
        if (njauCoreShow) {
          ztoolkit.ExtraField.setExtraField(item, '南农核心期', njauCore(item));
        }
        if (njauJourShow) {
          ztoolkit.ExtraField.setExtraField(item, '南农高质量期刊', njauJournal(item));
        }
        // 期刊缩写更新
        try {
          HelperExampleFactory.upJourAbb(item);
        } catch (error) {
          Zotero.debug('期刊缩写更新失败！')

        }
        item.saveTx();
        n++
      }
    }
    var whiteSpace = HelperExampleFactory.whiteSpace();
    HelperExampleFactory.progressWindow(`${n}${whiteSpace}${getString('upIfsSuccess')}`, 'success')

  }

  @example
  // 从easyScholar获取数据 获得影响因子 原接口函数
  /*
   static async getIFs(item: Zotero.Item) {
    var pt = (item.getField('publicationTitle') as any).toUpperCase();
    var data: any = {}; //data后加: any为了防止报错
    var optionCheckd = ['sci', 'sciif5', 'sciUp', 'sciBase', 'sciif', 'eii',   // 英文期刊：分区、中科院升级版、中科院基础版、IF、EI
      'cssci', 'cscd', 'pku', 'zhongguokejihexin']; // 中文期刊：南大核心、CSCD、北大核心、科技核心：
    data["requirePaperRank"] = optionCheckd;
    data["version"] = "5.6";
    data["website"] = "Zotero";
    data["papersName"] =
    {
      //     349: "NATURE",
      //     1807: "FOODS",
      2190: pt
    };  // key为自己生成，value为刊物名称（需要大写）

    data["paperTotal"] = Object.keys(data["papersName"]).length;
    var url = "https://easyscholar.cc/homeController/getPapersRank.ajax";
    var headers = { "Content-Type": "application/json" };
    // Maybe need to set max retry in this post request.
    var resp = await Zotero.HTTP.request("POST", url, {
      credentials: "include",
      body: JSON.stringify(data),
      headers: headers,
    });

    try {
      var updateJson = JSON.parse(resp.responseText);
      return updateJson["papersRank"][0];
    } catch (e) {
      Zotero.debug('从easyScholar获取数据失败!')

    }
  };
*/

  @example
  // 从easyScholar获取数据 获得影响因子 新接口函数
  static async getIFs(item: Zotero.Item) {
    var secretKey: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.secretkey`, true);
    var publicationTitle = encodeURI(item.getField('publicationTitle') as any);
    var url = `https://easyscholar.cc/open/getPublicationRank?secretKey=${secretKey}&publicationName=${publicationTitle}`;
    var resp = await Zotero.HTTP.request("GET", url);

    try {
      var updateJson = JSON.parse(resp.responseText);
      if (updateJson['msg'] == "SUCCESS") {
        return updateJson["data"]["officialRank"]["all"];
      } else {
        Zotero.debug(updateJson['msg'])
      }
    } catch (e) {
      Zotero.debug("获取easyScholar失败")
    }

  };

  @example
  // 设置复合影响因子及综合影响因子20220709
  // 代码源于@l0o0，感谢。
  static async getChineseIFs(item: Zotero.Item) {
    var chineseIFs = [];
    var pubT = item.getField('publicationTitle');
    var pattern = new RegExp("[\u4E00-\u9FA5]+");
    if (pattern.test(String(pubT))) { // 如果期刊名中含有中文才进行替换
      try {
        var body = `searchStateJson=%7B%22StateID%22%3A%22%22%2C%22Platfrom%22%3A%22%22%2C%22QueryTime%22%3A%22%22%2C%22Account%22%3A%22knavi%22%2C%22ClientToken%22%3A%22%22%2C%22Language%22%3A%22%22%2C%22CNode%22%3A%7B%22PCode%22%3A%22JOURNAL%22%2C%22SMode%22%3A%22%22%2C%22OperateT%22%3A%22%22%7D%2C%22QNode%22%3A%7B%22SelectT%22%3A%22%22%2C%22Select_Fields%22%3A%22%22%2C%22S_DBCodes%22%3A%22%22%2C%22QGroup%22%3A%5B%7B%22Key%22%3A%22subject%22%2C%22Logic%22%3A1%2C%22Items%22%3A%5B%5D%2C%22ChildItems%22%3A%5B%7B%22Key%22%3A%22txt%22%2C%22Logic%22%3A1%2C%22Items%22%3A%5B%7B%22Key%22%3A%22txt_1%22%2C%22Title%22%3A%22%22%2C%22Logic%22%3A1%2C%22Name%22%3A%22TI%22%2C%22Operate%22%3A%22%25%22%2C%22Value%22%3A%22'${encodeURIComponent(pubT)}'%22%2C%22ExtendType%22%3A0%2C%22ExtendValue%22%3A%22%22%2C%22Value2%22%3A%22%22%7D%5D%2C%22ChildItems%22%3A%5B%5D%7D%5D%7D%5D%2C%22OrderBy%22%3A%22OTA%7CDESC%22%2C%22GroupBy%22%3A%22%22%2C%22Additon%22%3A%22%22%7D%7D&displaymode=1&pageindex=1&pagecount=21&index=&searchType=%E5%88%8A%E5%90%8D(%E6%9B%BE%E7%94%A8%E5%88%8A%E5%90%8D)&clickName=&switchdata=search&random=0.2815758347350512`;
        var resp = await Zotero.HTTP.request(
          "POST",
          "https://navi.cnki.net/knavi/all/searchbaseinfo",
          {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36 Edg/103.0.1264.49",
            },
            body: body,
          }
        );
        var AllJour = resp.responseText;
        var reg = pubT + '\n(.*\n){10,40} .*复合影响因子：(.*)\n(.*\n){0,6} .*综合影响因子：(.*)'; //复合影响因子和综合影响因子正则，里面含有空格，\s不行
        var patt = new RegExp(reg, 'i'); //
        var jour = AllJour.match(patt) // [2]为复合影响因子，[4]为综合IF
        var compoundIF = jour[2];
        var comprehensiveIF = jour[4];
        if (compoundIF !== undefined) { chineseIFs.push(compoundIF); }
        if (comprehensiveIF !== undefined) { chineseIFs.push(comprehensiveIF); }
        return chineseIFs;

      } catch (e) {
        Zotero.debug('复合影响因子、综合影响因子获取失败！');
        return;
      }
    }
  };

  //分类右击更新信息
  @example
  static async upMetaCol() {
    var collection = ZoteroPane.getSelectedCollection();
    var items = collection?.getChildItems();
    await KeyExampleFactory.upMeta(items);
  }
  //条目右键更新信息
  @example
  static async upMetaItems() {
    var items = Zotero.getActiveZoteroPane().getSelectedItems();
    await KeyExampleFactory.upMeta(items);
  }

  @example
  //更新元数据执行函数
  // 代码来源于Quick动作
  //https://getquicker.net/Sharedaction?code=78da8f40-e73a-46e8-da6b-08da76a0d1ac和
  // https://getquicker.net/Sharedaction?code=305c5f6e-4f15-445c-996a-08dace1ee4e7
  //感谢@ttChen老师的源代码
  static async upMeta(items: any) {
    // var items = KeyExampleFactory.getSelectedItems();
    // var item = items[0];
    var n = 0;
    var pattern = new RegExp("[\u4E00-\u9FA5]+");
    for (let item of items) {
      if (UIExampleFactory.checkItem(item)) {//如果期刊才继续
        var title: any = item.getField("title");
        var doi = item.getField("DOI");
        var lan = pattern.test(title) ? 'zh-CN' : 'en-US';
        if (lan == 'zh-CN') { //中文条目
          async function getCNKIDetailURLByTitle(title: any) {
            var queryJson = {
              "Platform": "",
              "DBCode": "CFLS",
              "KuaKuCode": "CJFQ,CCND,CIPD,CDMD,BDZK,CISD,SNAD,CCJD,GXDB_SECTION,CJFN,CCVD",
              "QNode": {
                "QGroup": [{
                  "Key": "Subject",
                  "Title": "",
                  "Logic": 1,
                  "Items": [{ "Title": "篇名", "Name": "TI", "Value": title, "Operate": "%=", "BlurType": "" }],
                  "ChildItems": []
                }]
              }
            };

            var PostDATA =
              "IsSearch=true&QueryJson=" +
              encodeURIComponent(JSON.stringify(queryJson)) +
              `&PageName=defaultresult&DBCode=CFLS&KuaKuCodes=CJFQ%2CCCND%2CCIPD%2CCDMD%2CBDZK%2CCISD%2CSNAD%2CCCJD%2CGXDB_SECTION%2CCJFN%2CCCVD` +
              `&CurPage=1&RecordsCntPerPage=20&CurDisplayMode=listmode&CurrSortField=RELEVANT&CurrSortFieldType=desc&IsSentenceSearch=false&Subject=`;


            function getCookieSandbox() {
              var cookieData =
                `Ecp_ClientId=3210724131801671689;
            cnkiUserKey=2bf7144a-ddf6-3d32-afb8-d4bf82473d9f;
            RsPerPage=20;
            Ecp_ClientIp=58.154.105.222;
            Ecp_Userid=5002973;
            Hm_lvt_38f33a73da35494cc56a660420d5b6be=1657977228,1658755426,1659774372,1659793220;
            UM_distinctid=183d49fcff858b-0941bfea87e982-76492e2f-384000-183d49fcff9119c;
            knsLeftGroupSelectItem=1%3B2%3B; dsorder=relevant;
            _pk_ref=%5B%22%22%2C%22%22%2C1669645320%2C%22https%3A%2F%2Feasyscholar.cc%2F%22%5D;
            _pk_id=c26caf7b-3374-4899-9370-488df5c09825.1661393760.22.1669645320.1669645320.;
            Ecp_loginuserbk=db0172; Ecp_IpLoginFail=22113066.94.113.19;
            ASP.NET_SessionId=5mzsjs1nrl1tf0b5ec450grz; SID_kns8=123152;
            CurrSortField=%e7%9b%b8%e5%85%b3%e5%ba%a6%2frelevant%2c(%e5%8f%91%e8%a1%a8%e6%97%b6%e9%97%b4%2c%27time%27);
            CurrSortFieldType=DESC; dblang=ch`;

              var userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.56";
              var url = "https://cnki.net/";
              return new Zotero.CookieSandbox("", url, cookieData, userAgent);
            };


            var requestHeaders = {
              Accept: "text/html, */*; q=0.01",
              "Accept-Encoding": "gzip, deflate, br",
              "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              Connection: "keep-alive",
              "Content-Length": "992",
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
              Host: "kns.cnki.net",
              Origin: "https://kns.cnki.net",
              Referer: `https://kns.cnki.net/kns8/defaultresult/index?kw=${encodeURIComponent(title)}&korder=TI`,
              "Sec-Fetch-Dest": "empty",
              "Sec-Fetch-Mode": "cors",
              "Sec-ch-ua": `"Microsoft Edge"; v = "107", "Chromium"; v = "107", "Not=A?Brand"; v = "24"`,
              "Sec-Fetch-Site": "same-origin",
              "X-Requested-With": "XMLHttpRequest"
            };

            var postUrl = "https://kns.cnki.net/kns8/Brief/GetGridTableHtml";

            function getHtml(responseText: any) {
              var parser = Components.classes["@mozilla.org/xmlextras/domparser;1"]
                .createInstance(Components.interfaces.nsIDOMParser);
              var html = parser.parseFromString(responseText, "text/html");
              return html;
            };
            var resp = await Zotero.HTTP.request("POST", postUrl, {
              headers: requestHeaders,
              cookieSandbox: getCookieSandbox(),
              body: PostDATA
            });
            return getHtml(resp.responseText);
          }
          function updateField(field: any, newItem: Zotero.Item, oldItem: Zotero.Item) {
            if (newItem.getField(field)) {
              oldItem.setField(field, newItem.getField(field))
            }
          }
          function updateINFO(newItem: any, oldItemID: any) {
            newItem.saveTx();
            let oldItem = Zotero.Items.get(oldItemID)
            oldItem.setCreators(newItem.getCreators());
            // 可根据下述网址增减需要更新的Field.
            // https://www.zotero.org/support/dev/client_coding/javascript_api/search_fields
            let fields = ["title", "publicationTitle", "journalAbbreviation", "volume", "issue", "date", "pages", "ISSN", "url", "abstractNote", "DOI", "type", "publisher"]
            for (let field of fields) {
              updateField(field, newItem, oldItem);
            }
            newItem.deleted = true;
            newItem.saveTx();
            oldItem.saveTx();
            Zotero.debug("succeeded!");
          }
          //中文条目更新函数
          var selectedItem = item;
          var ItemID = selectedItem.id;
          var title: any = selectedItem.getField("title");
          var publicationTitle = selectedItem.getField("publicationTitle");
          var html;
          var url;
          try {
            html = await getCNKIDetailURLByTitle(title);
            if (publicationTitle != "") {
              url = (Zotero.Utilities as any).xpath(html, `//td[normalize-space(string(.))="${publicationTitle}"]/preceding-sibling::td[@class="name" and normalize-space(string(.))="${title}"]/a`)[0].href;
            } else {
              url = (Zotero.Utilities as any).xpath(html, `//td[@class="name" and normalize-space(string(.))="${title}"]/a`)[0].href;
            }

            url = url.replace("/kns8/Detail", "https://kns.cnki.net/kcms/detail/detail.aspx");
          } catch (error) {
            var popw = new Zotero.ProgressWindow();
            popw.changeHeadline("未找到文献, 或者遇到了网络问题！", "", "");
            popw.addDescription(`文献：${title}`);
            popw.show();
            popw.startCloseTimer(5 * 1000);

            return;
            return;
          }
          Zotero.HTTP.loadDocuments(url,
            async function (doc: any) {
              let translate = new Zotero.Translate.Web();
              translate.setDocument(doc);
              translate.setTranslator("5c95b67b-41c5-4f55-b71a-48d5d7183063");
              let items = await translate.translate();
              updateINFO(items[0], ItemID)
            }
          );

        } else if (lan == 'en-US') {//英文条目
          if (doi != '') {
            let identifier =
            {
              itemType: "journalArticle",
              DOI: item.getField('DOI')
            };
            var translate = new Zotero.Translate.Search();
            translate.setIdentifier(identifier);
            let translators = await translate.getTranslators();
            translate.setTranslator(translators);
            let newItems = await translate.translate();
            let newItem = newItems[0];

            function update(field: any) {
              if (newItem.getField(field)) {
                item.setField(field, newItem.getField(field))
              }
            }
            item.setCreators(newItem.getCreators());

            // 可根据下述网址增减需要更新的Field.
            // https://www.zotero.org/support/dev/client_coding/javascript_api/search_fields

            let fields = ["title", "publicationTitle", "journalAbbreviation", "volume",
              "issue", "date", "pages", "issue", "ISSN", "url", "abstractNote"
            ]

            for (let field of fields) {
              update(field);
            }

            newItem.deleted = true;
            await item.saveTx();
            newItem.saveTx();
          }
        }
        n++
      }
    }
    var whiteSpace = HelperExampleFactory.whiteSpace();
    HelperExampleFactory.progressWindow(`${n}${whiteSpace}${getString('upIfsSuccess')}`, 'success')
  }
  @example
  static registerShortcuts() {
    // const keysetId = `${config.addonRef}-keyset`;
    // const cmdsetId = `${config.addonRef}-cmdset`;
    // const cmdSmallerId = `${config.addonRef}-cmd-smaller`;
    // Register an event key for Alt+D 数据目录
    ztoolkit.Shortcut.register("event", {
      id: `${config.addonRef}-key-data-dir`,
      // key: "L",
      key: "D",
      modifiers: "alt",
      callback: (keyOptions) => {
        // addon.hooks.onShortcuts("larger");
        HelperExampleFactory.progressWindow(`${getString('dataDir')} ${Zotero.DataDirectory.dir}`, 'success')
      },
    });

    // Register an event key for Alt+P 配置目录
    ztoolkit.Shortcut.register("event", {
      id: `${config.addonRef}-key-profile-dir`,
      // key: "L",
      key: "P",
      modifiers: "alt",
      callback: (keyOptions) => {
        // addon.hooks.onShortcuts("larger");
        HelperExampleFactory.progressWindow(`${getString('proDir')} ${Zotero.Profile.dir}`, 'success')
      },
    });

    // Register an element key using <key> for Alt+S
    /*
     ztoolkit.Shortcut.register("element", {
       id: `${config.addonRef}-key-smaller`,
       key: "S",
       modifiers: "alt",
       xulData: {
         document,
         command: cmdSmallerId,
         _parentId: keysetId,
         _commandOptions: {
           id: cmdSmallerId,
           document,
           _parentId: cmdsetId,
           oncommand: `'Zotero.${config.addonInstance}.hooks.onShortcuts('smaller')'`,
         },
       },
     });
     */
    // Here we register an conflict key for Alt+S
    // just to show how the confliction check works.
    // This is something you should avoid in your plugin.
    /*
    ztoolkit.Shortcut.register("event", {
      id: `${config.addonRef}-key-smaller-conflict`,
      key: "S",
      modifiers: "alt",
      callback: (keyOptions) => {
        ztoolkit.getGlobal("alert")("Smaller! This is a conflict key.");
      },
    });
    */
    // Register an event key to check confliction
    /*
        ztoolkit.Shortcut.register("event", {
          id: `${config.addonRef}-key-check-conflict`,
          key: "C",
          modifiers: "alt",
          callback: (keyOptions) => {
            addon.hooks.onShortcuts("confliction");
          },
        });
        */
    /*
    new ztoolkit.ProgressWindow(config.addonName)
      .createLine({
        text: "Example Shortcuts: Alt+L/S/C",
        type: "success",
      })
      .show();
    */
  }

  /*
  @example
  static exampleShortcutLargerCallback() {
    new ztoolkit.ProgressWindow(config.addonName)
      .createLine({
        text: "Larger!",
        type: "default",
      })
      .show();
  }

  @example
  static exampleShortcutSmallerCallback() {
    new ztoolkit.ProgressWindow(config.addonName)
      .createLine({
        text: "Smaller!",
        type: "default",
      })
      .show();
  }
*/
  @example
  static exampleShortcutConflictionCallback() {
    const conflictionGroups = ztoolkit.Shortcut.checkAllKeyConflicting();
    new ztoolkit.ProgressWindow("Check Key Confliction")
      .createLine({
        text: `${conflictionGroups.length} groups of confliction keys found. Details are in the debug output/console.`,
      })
      .show(-1);
    ztoolkit.log(
      "Conflictions:",
      conflictionGroups,
      "All keys:",
      ztoolkit.Shortcut.getAll()
    );
  }
}

export class UIExampleFactory {

  // 是否显示菜单函数 类型为期刊才显示可用
  // 是否显示分类右键菜单 隐藏
  static displayColMenuitem() {
    const collection = ZoteroPane.getSelectedCollection(),
      menuUpIFsCol = document.getElementById(`zotero-collectionmenu-${config.addonRef}-upifs`), // 删除分类及附件菜单
      menuUpMeta = document.getElementById(`zotero-collectionmenu-${config.addonRef}-upmeta`); // 导出分类附件菜单

    // 非正常文件夹，如我的出版物、重复条目、未分类条目、回收站，为false，此时返回值为true，禁用菜单
    // 两个！！转表达式为逻辑值
    var showmenuUpIFsCol = !!collection;
    var showmenuUpMetaCol = !!collection;

    if (!!collection) { // 如果是正常分类才显示
      var items = collection.getChildItems();
      showmenuUpIFsCol = items.some((item) => UIExampleFactory.checkItem(item)); //检查是否为期刊
      showmenuUpMetaCol = items.some((item) => UIExampleFactory.checkItemMeta(item)); // 更新元数据 中文有题目，英文检查是否有DOI
    } else {
      showmenuUpIFsCol = false;
    } // 检查分类是否有附件及是否为正常分类
    menuUpIFsCol?.setAttribute('disabled', String(!showmenuUpIFsCol)); // 禁用更新期刊信息
    menuUpMeta?.setAttribute('disabled', String(!showmenuUpMetaCol)); // 禁用更新元数据
  }

  // 禁用菜单
  // static disableMenu() {
  //   // 禁用添加条目更新期刊信息
  //   var menuUpAdd = document.getElementById('zotero-prefpane-greenfrog-add-update');
  //   menuUpAdd?.setAttribute('disabled', 'ture');
  //   menuUpAdd?.setAttribute('hidden', 'ture');
  // }
  // 是否显示条目右键菜单
  static displayContexMenuitem() {
    const items = ZoteroPane.getSelectedItems(),
      menuUpIfs = document.getElementById(`zotero-itemmenu-${config.addonRef}-upifs`), // 更新期刊信息
      menuUpMeta = document.getElementById(`zotero-itemmenu-${config.addonRef}-upmeta`), // 更新元数据

      showMenuUpIfs = items.some((item) => UIExampleFactory.checkItem(item)),// 更新期刊信息 检查是否为期刊
      showMenuUpMeta = items.some((item) => UIExampleFactory.checkItemMeta(item)); // 更新元数据 检查是否有DOI

    menuUpIfs?.setAttribute('disabled', `${!showMenuUpIfs}`); // 禁用更新期刊信息
    menuUpMeta?.setAttribute('disabled', `${!showMenuUpMeta}`); // 更新元数据
  }



  // 检查条目是否符合 是否为期刊
  static checkItem(item: Zotero.Item) {
    if (item && !item.isNote()) {
      if (item.isRegularItem()) { // not an attachment already
        if (Zotero.ItemTypes.getName(item.itemTypeID) == 'journalArticle' // 文献类型为期刊
        ) { return true }
      }
    }
  };

  // 检查条目元数据是否符合 英文必须有DOI
  static checkItemMeta(item: Zotero.Item) {
    var pattern = new RegExp("[\u4E00-\u9FA5]+");
    if (item && !item.isNote()) {
      if (item.isRegularItem()) { // not an attachment already
        var title: any = item.getField("title");
        var doi = item.getField("DOI");
        var lan = pattern.test(title) ? 'zh-CN' : 'en-US';
        if (Zotero.ItemTypes.getName(item.itemTypeID) == 'journalArticle' // 文献类型必须为期刊
        ) {
          if (lan == 'zh-CN') { //中文条目
            return title == '' ? false : true; // 题目为空时不能更新中文
          } else if (lan == 'en-US') {//英文条目
            return doi == '' ? false : true; // 英文DOI为空时不能更新英文
          }
        }
      }
    }
  };

  /*
  @example
  static registerStyleSheet() {
    const styles = ztoolkit.UI.createElement(document, "link", {
      properties: {
        type: "text/css",
        rel: "stylesheet",
        href: `chrome://${config.addonRef}/content/zoteroPane.css`,
      },
    });
    document.documentElement.appendChild(styles);
    document
      .getElementById("zotero-item-pane-content")
      ?.classList.add("makeItRed");
  }
*/

  // 右键菜单
  @example
  static registerRightClickMenuItem() {
    const menuIconUpIFs = `chrome://${config.addonRef}/content/icons/favicon@0.5x.png`;
    const menuIconUpMeta = `chrome://${config.addonRef}/content/icons/upmeta.png`;
    // ztoolkit.Menu.register("item", {
    //   tag: "menuseparator",
    // });
    // item menuitem with icon
    // ztoolkit.Menu.register("item", {
    //   tag: "menuitem",
    //   id: "zotero-itemmenu-addontemplate-test",
    //   label: getString("menuitem.label"),
    //   commandListener: (ev) => addon.hooks.onDialogEvents("dialogExample"),
    //   icon: menuIcon,
    // });
    ztoolkit.Menu.register("item", {
      tag: "menuseparator",
    });

    // 分类右键
    ztoolkit.Menu.register("collection", {
      tag: "menuseparator",
    });
    // 分类更新条目信息
    ztoolkit.Menu.register("collection", {
      tag: "menuitem",
      id: `zotero-collectionmenu-${config.addonRef}-upifs`,
      label: getString("upifs"),
      commandListener: (ev) => KeyExampleFactory.setExtraCol(),
      icon: menuIconUpIFs,
    });
    // 分类更新元数据
    ztoolkit.Menu.register("collection", {
      tag: "menuitem",
      id: `zotero-collectionmenu-${config.addonRef}-upmeta`,
      label: getString("upmeta"),
      commandListener: (ev) => KeyExampleFactory.upMetaCol(),
      icon: menuIconUpMeta,
    });
    // 更新条目信息
    ztoolkit.Menu.register("item", {
      tag: "menuitem",
      id: `zotero-itemmenu-${config.addonRef}-upifs`,
      label: getString("upifs"),
      commandListener: (ev) => KeyExampleFactory.setExtraItems(),
      icon: menuIconUpIFs,
    });
    // 条目更新元数据
    ztoolkit.Menu.register("item", {
      tag: "menuitem",
      id: `zotero-itemmenu-${config.addonRef}-upmeta`,
      label: getString("upmeta"),
      commandListener: (ev) => KeyExampleFactory.upMetaItems(),
      icon: menuIconUpMeta,
    });
  }
  // @example
  // static registerRightClickMenuPopup() {
  //   ztoolkit.Menu.register(
  //     "item",
  //     {
  //       tag: "menu",
  //       label: getString("menupopup.label"),
  //       children: [
  //         {
  //           tag: "menuitem",
  //           label: getString("menuitem.submenulabel"),
  //           oncommand: "alert('Hello World! Sub Menuitem.')",
  //         },
  //       ],
  //     },
  //     "before",
  //     document.querySelector(
  //       "#zotero-itemmenu-addontemplate-test"
  //     ) as XUL.MenuItem
  //   );
  // }

  @example //Tools菜单
  static registerWindowMenuWithSeprator() {
    ztoolkit.Menu.register("menuTools", {
      tag: "menuseparator",
    });
    // menu->Tools menuitem
    // ztoolkit.Menu.register("menuTools", {
    //   tag: "menu",
    //   label: getString("menuitem.filemenulabel"),

    // onpopupshowing:  `Zotero.${config.addonInstance}.hooks.hideMenu()`,// 显示隐藏菜单
    // children: [
    //   {
    //     tag: "menuitem",
    //     label: getString("menuitem.submenulabel"),
    //     // oncommand: "alert('Hello World! Sub Menuitem.')",
    //     commandListener: (ev) => HelperExampleFactory.dialogAuBoldStar(),
    //   },

    // ],
    //oncommand: "alert('Hello World! File Menuitem.')",
    ztoolkit.Menu.register("menuTools", {
      tag: "menu",
      label: getString("toolbox"),
      onpopupshowing: `Zotero.${config.addonInstance}.hooks.hideMenu()`,// 显示隐藏菜单

      children: [
        // Author Bold and/ or Asterisk 作者加粗加星
        {
          tag: "menuitem",
          id: "zotero-toolboxmenu-auBoldStar",
          label: getString("auBoldStar"),
          // oncommand: "alert('Hello World! Sub Menuitem.')",
          commandListener: (ev) => HelperExampleFactory.dialogAuProcess(),
        },
        // Clean Author Bold 清除作者加粗
        {
          tag: "menuitem",
          id: "zotero-toolboxmenu-cleanBold",
          label: getString("cleanBold"),
          // oncommand: "alert('Hello World! Sub Menuitem.')",
          commandListener: (ev) => HelperExampleFactory.cleanBold(),
        },
        // Clean Author Asterisk清除作者加星
        {
          tag: "menuitem",
          id: "zotero-toolboxmenu-cleanStar",
          label: getString("cleanStar"),
          // oncommand: "alert('Hello World! Sub Menuitem.')",
          commandListener: (ev) => HelperExampleFactory.cleanStar(),
        },
        // Clean Author Bold and Asterisk 清除作者加粗加星
        {
          tag: "menuitem",
          id: "zotero-toolboxmenu-cleanBoldStar",
          label: getString("cleanBoldStar"),
          // oncommand: "alert('Hello World! Sub Menuitem.')",
          commandListener: (ev) => HelperExampleFactory.cleanBoldAndStar(),
        },
        // Change Author Name to Title Case 更改作者大小写
        {
          tag: "menuitem",
          id: "zotero-toolboxmenu-chAuTitle",
          label: getString("chAuTitle"),
          // oncommand: "alert('Hello World! Sub Menuitem.')",
          commandListener: (ev) => HelperExampleFactory.changAuthorCase(),
        },
        // Swap Authors First and Last Name 交换作者姓和名
        {
          tag: "menuitem",
          id: "zotero-toolboxmenu-swapAuName",
          label: getString("swapAuName"),
          // oncommand: "alert('Hello World! Sub Menuitem.')",
          commandListener: (ev) => HelperExampleFactory.swapAuthorName(),
        },
        {
          tag: "menuseparator",
          id: "zotero-toolboxmenu-sep1"
        },
        // Change Title to Sentense Case 条目题目大小写
        {
          tag: "menuitem",
          id: "zotero-toolboxmenu-chTitleCase",
          label: getString("chTitleCase"),
          // oncommand: "alert('Hello World! Sub Menuitem.')",
          commandListener: (ev) => HelperExampleFactory.chanItemTitleCase(),
        },
        // Change Publication Title
        {
          tag: "menuitem",
          id: "zotero-toolboxmenu-chPubTitle",
          label: getString("chPubTitle"),
          // oncommand: "alert('Hello World! Sub Menuitem.')",
          commandListener: (ev) => HelperExampleFactory.dialogChPubTitle(),
        },
        // Change Publication Title Case 更改期刊大小写
        {
          tag: "menuitem",
          id: "zotero-toolboxmenu-chPubTitleCase",
          label: getString("chPubTitleCase"),
          // oncommand: "alert('Hello World! Sub Menuitem.')",
          commandListener: (ev) => HelperExampleFactory.chPubTitleCase(),
        },
        // Item Title Find and Replace 条目题目查找替换
        {
          tag: "menuitem",
          id: "zotero-toolboxmenu-itemTitleFindReplace",
          label: getString("itemTitleFindReplace"),
          // oncommand: "alert(KeyExampleFactory.getSelectedItems())",
          // oncommand: `ztoolkit.getGlobal('alert')(${KeyExampleFactory.getSelectedItems()})`,
          commandListener: (ev) => HelperExampleFactory.dialogItemTitleProcess(),
        },
        {
          tag: "menuseparator",
          id: "zotero-toolboxmenu-sep2"
        },
        // Show Porfile Directory
        {
          tag: "menuitem",
          id: "zotero-toolboxmenu-showProfile",
          label: getString("showProfile"),
          // oncommand: "alert('Hello World! Sub Menuitem.')",
          commandListener: (ev) => HelperExampleFactory.progressWindow(`${getString('proDir')} ${Zotero.Profile.dir}`, 'success'),
        },
        // Show Data Directory
        {
          tag: "menuitem",
          id: "zotero-toolboxmenu-showData",
          label: getString("showData"),
          // oncommand: "alert('Hello World! Sub Menuitem.')",
          commandListener: (ev) => HelperExampleFactory.progressWindow(`${getString('dataDir')} ${Zotero.DataDirectory.dir}`, 'success'),
        },
        //刷新自定义列
        // {
        //   tag: "menuitem",
        //   id: "zotero-toolboxmenu-refresh",
        //   label: '缩写',
        //   commandListener: (ev) => HelperExampleFactory.upJourAbb(),
        // },
      ],
    });
    ztoolkit.Menu.register("menuTools", {
      tag: "menuitem",
      label: getString("cleanExtra"),
      commandListener: (ev) => HelperExampleFactory.emptyExtra(),

    })
  }

  // 显示隐藏工具箱中的菜单
  @example
  static hideMenu() {
    const menuboldStar = document.getElementById('zotero-toolboxmenu-auBoldStar'),  //
      menucleanBold = document.getElementById('zotero-toolboxmenu-cleanBold'),  //
      menucleanStar = document.getElementById('zotero-toolboxmenu-cleanStar'),  //
      menucleanBoldStar = document.getElementById('zotero-toolboxmenu-cleanBoldStar'),  //
      menuchAuTitle = document.getElementById('zotero-toolboxmenu-chAuTitle'),  //
      menuswapAuName = document.getElementById('zotero-toolboxmenu-swapAuName'),  //
      menusep1 = document.getElementById('zotero-toolboxmenu-sep1'),  //
      menuchTitleCase = document.getElementById('zotero-toolboxmenu-chTitleCase'),  //
      menuchPubTitle = document.getElementById('zotero-toolboxmenu-chPubTitle'),  //
      menuchPubTitleCase = document.getElementById('zotero-toolboxmenu-chPubTitleCase'),  //
      menuitemTitleFindReplace = document.getElementById('zotero-toolboxmenu-itemTitleFindReplace'),  //
      menusep2 = document.getElementById('zotero-toolboxmenu-sep2'),  //
      menushowProfile = document.getElementById('zotero-toolboxmenu-showProfile'),  //
      menushowData = document.getElementById('zotero-toolboxmenu-showData');  //

    const boldStar = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.bold.star`, true),
      cleanBold = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.remove.bold`, true),
      cleanStar = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.remove.star`, true),
      cleanBoldStar = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.remove.bold.star`, true),
      chAuTitle = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.chang.author.case`, true),
      swapAuName = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.swap.author`, true),
      sep1 = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.sep1`, true),
      chTitleCase = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.chang.title`, true),
      chPubTitle = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.chang.pub.title`, true),
      chPubTitleCase = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.chang.pub.title.case`, true),
      itemTitleFindReplace = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.item.title.find.replace`, true),
      sep2 = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.sep2`, true),
      showProfile = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.show.profile.dir`, true),
      showData = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.show.data.dir`, true);

    // menuboldStar?.setAttribute('hidden', String(!boldStar));
    menuboldStar?.setAttribute('hidden', String(!boldStar));
    menucleanBold?.setAttribute('hidden', String(!cleanBold));
    menucleanStar?.setAttribute('hidden', String(!cleanStar));
    menucleanBoldStar?.setAttribute('hidden', String(!cleanBoldStar));
    menuchAuTitle?.setAttribute('hidden', String(!chAuTitle));
    menuswapAuName?.setAttribute('hidden', String(!swapAuName));
    menusep1?.setAttribute('hidden', String(!sep1));
    menuchTitleCase?.setAttribute('hidden', String(!chTitleCase));
    menuchPubTitle?.setAttribute('hidden', String(!chPubTitle));
    menuchPubTitleCase?.setAttribute('hidden', String(!chPubTitleCase));
    menuitemTitleFindReplace?.setAttribute('hidden', String(!itemTitleFindReplace));
    menusep2?.setAttribute('hidden', String(!sep2));
    menushowProfile?.setAttribute('hidden', String(!showProfile));
    menushowData?.setAttribute('hidden', String(!showData));

    // menuboldStar?.setAttribute('disabled', 'true');
    // (document.getElementById('zotero-toolboxmenu-auBoldStar') as HTMLElement).hidden = !boldStar;



  }
  // @example
  //添加工具栏按钮
  // static refreshButton() {
  //   document.getElementById('zotero-collections-toolbar')?.appendChild( // 添加工具栏按钮
  //     ztoolkit.UI.createElement(document, 'toolbarbutton', {
  //       id: 'refresh-toolbar-button',
  //       classList: ['zotero-tb-button'],
  //       attributes: { tooltiptext: 'refrsh item tree' },
  //       styles: {
  //         'list-style-image': 'url("chrome://greenfrog/content/icons/favicon@0.5x.png");',
  //       },
  //       listeners: [{ type: 'command', listener: Zotero.greenfrog.hooks.setExtraColumn }]
  //     })
  //   );
  // var _window: Window = Zotero.getMainWindow();
  // var tool_button = _window.document.createElement("toolbarbutton");
  // tool_button.id = "zotero-tb-tara";
  // tool_button.setAttribute("type", "button");
  // tool_button.className = "zotero-tb-button";
  // tool_button.style["list-style-image"] =
  //   "url('chrome://greenfrog/content/icons/favicon@0.5x.png')";

  // document
  //   .querySelector("#zotero-collections-toolbar")
  //   .appendChild(tool_button);
  // }
  @example
  // 当更新期刊禁用时，禁用期刊是否带点选项
  static disableUppJourAbbDot() {
    var cbUpJourAbbDot = addon.data.prefs!.window.document.getElementById(`zotero-prefpane-${config.addonRef}-update-abbr-dot`);
    var upAbbr = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.update.abbr`, true);
    // HelperExampleFactory.progressWindow(`${upAbbr} check`, 'default');
    cbUpJourAbbDot?.setAttribute('disabled', String(!upAbbr)); // 当更新期刊禁用时，禁用期刊是否带点选项
    //
    //

  }


  @example
  static async registerExtraColumn() {
    var jcr: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.jcr.qu`, true);
    var basic: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.basic`, true);
    var updated: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.updated`, true);
    var ifs: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.sci.if`, true);
    var if5: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.sci.if5`, true);
    var eii: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.ei`, true);
    var chjcscd: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.chjcscd`, true);
    var pkucore: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.pku.core`, true);
    var njucore: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.nju.core`, true);
    var scicore: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.sci.core`, true);
    var ssci: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.ssci`, true);
    var ajg: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.ajg`, true);
    var utd24: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.utd24`, true);
    var ft50: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.ft50`, true);
    var ccf: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.ccf`, true);
    var fms: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.fms`, true);
    var jci: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.jci`, true);
    var ahci: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.ahci`, true);
    var compoundIFs: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.com.if`, true);
    var comprehensiveIFs: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.agg.if`, true);
    var njauCoreShow = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.njau.core`, true);
    var njauJourShow = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.njau.high.quality`, true);
    // JCR
    if (jcr) {

      await ztoolkit.ItemTree.register(
        "JCR",
        getString("JCR"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var jcr = ztoolkit.ExtraField.getExtraField(item, 'JCR分区')
          return String(jcr == undefined ? '' : jcr);
        },
      );
    } else {

      await ztoolkit.ItemTree.unregister("JCR");
    }
    // 中科院分区升级版
    if (updated) {

      await ztoolkit.ItemTree.register(
        "CASUp",
        getString("CASUp"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var CASUp = ztoolkit.ExtraField.getExtraField(item, '中科院分区升级版')
          return String(CASUp == undefined ? '' : CASUp);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("CASUp");
    }
    // 中科院分区基础版
    if (basic) {
      await ztoolkit.ItemTree.register(
        "CASBasic",
        getString("CASBasic"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var CASBasic = ztoolkit.ExtraField.getExtraField(item, '中科院分区基础版')
          return String(CASBasic == undefined ? '' : CASBasic);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("CASBasic");
    }
    // 影响因子
    if (ifs) {
      await ztoolkit.ItemTree.register(
        "IF",
        getString("IF"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var ifs = ztoolkit.ExtraField.getExtraField(item, '影响因子')
          return String(ifs == undefined ? '' : ifs);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("IF");
    }
    // 5年影响因子
    if (if5) {
      await ztoolkit.ItemTree.register(
        "IF5",
        getString("IF5"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var IF5 = ztoolkit.ExtraField.getExtraField(item, '5年影响因子')
          return String(IF5 == undefined ? '' : IF5);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("IF5");
    }
    // EI
    if (eii) {
      await ztoolkit.ItemTree.register(
        "EI",
        getString("EI"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var EI = ztoolkit.ExtraField.getExtraField(item, 'EI')
          return String(EI == undefined ? '' : EI);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("EI");
    }
    // CSCD
    if (chjcscd) {
      await ztoolkit.ItemTree.register(
        "CSCD",
        getString("CSCD"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var CSCD = ztoolkit.ExtraField.getExtraField(item, 'CSCD')
          return String(CSCD == undefined ? '' : CSCD);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("CSCD");
    }
    // PKUCore
    if (pkucore) {

      await ztoolkit.ItemTree.register(
        "PKUCore",
        getString("PKUCore"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var PKUCore = ztoolkit.ExtraField.getExtraField(item, '中文核心期刊/北大核心')
          return String(PKUCore == undefined ? '' : PKUCore);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("PKUCore");
    }
    // CSSCI/南大核心
    if (njucore) {
      await ztoolkit.ItemTree.register(
        "CSSCI",
        getString("CSSCI"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var NJUCore = ztoolkit.ExtraField.getExtraField(item, 'CSSCI/南大核心')
          return String(NJUCore == undefined ? '' : NJUCore);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("CSSCI");
    }
    // 科技核心
    if (scicore) {
      await ztoolkit.ItemTree.register(
        "SCICore",
        getString("SCICore"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var SCICore = ztoolkit.ExtraField.getExtraField(item, '中国科技核心期刊')
          return String(SCICore == undefined ? '' : SCICore);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("SCICore");
    }


    // ssci
    if (ssci) {
      await ztoolkit.ItemTree.register(
        "SSCI",
        getString("SSCI"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var SSCI = ztoolkit.ExtraField.getExtraField(item, 'SSCI')
          return String(SSCI == undefined ? '' : SSCI);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("SSCI");
    }
    // ajg
    if (ajg) {
      await ztoolkit.ItemTree.register(
        "AJG",
        getString("AJG"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var AJG = ztoolkit.ExtraField.getExtraField(item, 'AJG')
          return String(AJG == undefined ? '' : AJG);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("AJG");
    }

    // utd24
    if (utd24) {
      await ztoolkit.ItemTree.register(
        "UTD24",
        getString("UTD24"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var UTD24 = ztoolkit.ExtraField.getExtraField(item, 'UTD24')
          return String(UTD24 == undefined ? '' : UTD24);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("UTD24");
    }

    // ft50
    if (ft50) {
      await ztoolkit.ItemTree.register(
        "FT50",
        getString("FT50"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var FT50 = ztoolkit.ExtraField.getExtraField(item, 'FT50')
          return String(FT50 == undefined ? '' : FT50);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("FT50");
    }

    // ccf
    if (ccf) {
      await ztoolkit.ItemTree.register(
        "CCF",
        getString("CCF"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var CCF = ztoolkit.ExtraField.getExtraField(item, 'CCF')
          return String(CCF == undefined ? '' : CCF);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("CCF");
    }

    // fms
    if (fms) {
      await ztoolkit.ItemTree.register(
        "FMS",
        getString("FMS"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var FMS = ztoolkit.ExtraField.getExtraField(item, 'FMS')
          return String(FMS == undefined ? '' : FMS);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("FMS");
    }

    // jci
    if (jci) {
      await ztoolkit.ItemTree.register(
        "JCI",
        getString("JCI"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var JCI = ztoolkit.ExtraField.getExtraField(item, 'JCI')
          return String(JCI == undefined ? '' : JCI);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("JCI");
    }

    // ahci
    if (ahci) {
      await ztoolkit.ItemTree.register(
        "AHCI",
        getString("AHCI"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var AHCI = ztoolkit.ExtraField.getExtraField(item, 'AHCI')
          return String(AHCI == undefined ? '' : AHCI);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("AHCI");
    }

    // 复合影响因子
    if (compoundIFs) {
      await ztoolkit.ItemTree.register(
        "compoundIF",
        getString("compoundIF"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var compoundIF = ztoolkit.ExtraField.getExtraField(item, '复合影响因子')
          return String(compoundIF == undefined ? '' : compoundIF);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("compoundIF");
    }
    // 综合影响因子
    if (comprehensiveIFs) {
      await ztoolkit.ItemTree.register(
        "comprehensiveIF",
        getString("comprehensiveIF"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var comprehensiveIF = ztoolkit.ExtraField.getExtraField(item, '综合影响因子')
          return String(comprehensiveIF == undefined ? '' : comprehensiveIF);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("comprehensiveIF");
    }
    // 南农核心期刊
    if (njauCoreShow) {
      await ztoolkit.ItemTree.register(
        "njauCore",
        getString("njauCore"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var njauCore = ztoolkit.ExtraField.getExtraField(item, '南农核心期')
          return String(njauCore == undefined ? '' : njauCore);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("njauCore");
    }
    // 南农高质量期刊
    if (njauJourShow) {
      await ztoolkit.ItemTree.register(
        "njauJour",
        getString("njauJour"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var njauJourIF = ztoolkit.ExtraField.getExtraField(item, '南农高质量期刊')
          return String(njauJourIF == undefined ? '' : njauJourIF);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("njauJour");
    }
  }

  // @example
  // static async registerExtraColumnWithCustomCell() {
  //   await ztoolkit.ItemTree.register(
  //     // "test2",
  //     // "custom column",
  //     "JCR",
  //     "JCR",
  //     (
  //       field: string,
  //       unformatted: boolean,
  //       includeBaseMapped: boolean,
  //       item: Zotero.Item
  //     ) => {
  //       // return String(item.id);
  //       var jcr = ztoolkit.ExtraField.getExtraField(item, 'JCR分区')
  //       return String(jcr == undefined ? '' : jcr);
  //     },
  //     // {
  //     //   renderCellHook(index, data, column) {
  //     //     const span = document.createElementNS(
  //     //       "http://www.w3.org/1999/xhtml",
  //     //       "span"
  //     //     );
  //     //     span.style.background = "#0dd068";
  //     //     span.innerText = "⭐" + data;
  //     //     return span;
  //     //   },
  //     // }
  //   );
  // }
  /*
    @example
    static async registerCustomCellRenderer() {
      await ztoolkit.ItemTree.addRenderCellHook(
        "title",
        (index: number, data: string, column: any, original: Function) => {
          const span = original(index, data, column) as HTMLSpanElement;
          span.style.background = "rgb(30, 30, 30)";
          span.style.color = "rgb(156, 220, 240)";
          return span;
        }
      );
      // @ts-ignore
      // This is a private method. Make it public in toolkit.
      await ztoolkit.ItemTree.refresh();
    }

    @example
    static registerLibraryTabPanel() {
      const tabId = ztoolkit.LibraryTabPanel.register(
        getString("tabpanel.lib.tab.label"),
        (panel: XUL.Element, win: Window) => {
          const elem = ztoolkit.UI.createElement(win.document, "vbox", {
            children: [
              {
                tag: "h2",
                properties: {
                  innerText: "Hello World!",
                },
              },
              {
                tag: "div",
                properties: {
                  innerText: "This is a library tab.",
                },
              },
              {
                tag: "button",
                namespace: "html",
                properties: {
                  innerText: "Unregister",
                },
                listeners: [
                  {
                    type: "click",
                    listener: () => {
                      ztoolkit.LibraryTabPanel.unregister(tabId);
                    },
                  },
                ],
              },
            ],
          });
          panel.append(elem);
        },
        {
          targetIndex: 1,
        }
      );
    }

    @example
    static async registerReaderTabPanel() {
      const tabId = await ztoolkit.ReaderTabPanel.register(
        getString("tabpanel.reader.tab.label"),
        (
          panel: XUL.TabPanel | undefined,
          deck: XUL.Deck,
          win: Window,
          reader: _ZoteroTypes.ReaderInstance
        ) => {
          if (!panel) {
            ztoolkit.log(
              "This reader do not have right-side bar. Adding reader tab skipped."
            );
            return;
          }
          ztoolkit.log(reader);
          const elem = ztoolkit.UI.createElement(win.document, "vbox", {
            id: `${config.addonRef}-${reader._instanceID}-extra-reader-tab-div`,
            // This is important! Don't create content for multiple times
            // ignoreIfExists: true,
            removeIfExists: true,
            children: [
              {
                tag: "h2",
                properties: {
                  innerText: "Hello World!",
                },
              },
              {
                tag: "div",
                properties: {
                  innerText: "This is a reader tab.",
                },
              },
              {
                tag: "div",
                properties: {
                  innerText: `Reader: ${reader._title.slice(0, 20)}`,
                },
              },
              {
                tag: "div",
                properties: {
                  innerText: `itemID: ${reader.itemID}.`,
                },
              },
              {
                tag: "button",
                namespace: "html",
                properties: {
                  innerText: "Unregister",
                },
                listeners: [
                  {
                    type: "click",
                    listener: () => {
                      ztoolkit.ReaderTabPanel.unregister(tabId);
                    },
                  },
                ],
              },
            ],
          });
          panel.append(elem);
        },
        {
          targetIndex: 1,
        }
      );
    }
    */
}

/*
export class PromptExampleFactory {

  @example
  static registerAlertPromptExample() {
    ztoolkit.Prompt.register([
      {
        name: "Template Test",
        label: "Plugin Template",
        callback(prompt) {
          ztoolkit.getGlobal("alert")("Command triggered!");
        },
      },
    ]);
  }
}

*/
export class HelperExampleFactory {

  // 生成空格，如果是中文是无空格，英文为空格
  static whiteSpace() {
    var lanUI = Zotero.Prefs.get('intl.locale.requested', true); // 得到当前Zotero界面语言
    var whiteSpace = ' ';
    if (lanUI == 'zh-CN') { whiteSpace = '' };
    return whiteSpace;
  };

  static async emptyExtra() {
    var items: any = KeyExampleFactory.getSelectedItems();
    if (items.length == 0) {
      var alertInfo = getString('zeroItem');
      this.progressWindow(alertInfo, 'fail');
      return;
    } else {

      var truthBeTold = window.confirm(getString('cleanExtraAlt'));
      if (truthBeTold) {
        for (let item of items) {

          if (item.isRegularItem() && !item.isCollection()) {
            try {
              item.setField('extra', '');
              item.save();

            } catch (error) {
              Zotero.debug('Extra清空失败！')
            }
          }
        }
        var alertInfo = getString("cleanExtraSuc");
        HelperExampleFactory.progressWindow(alertInfo, 'success');
      }
    }
  }

  // 更改期刊名称
  // static async chPubTitle(searchText: string, repText: string) {
  //   new ztoolkit.ProgressWindow(config.addonName)
  //     .createLine({
  //       text: 'find:' + searchText + 'replace:' + repText,
  //       type: "success",
  //       progress: 100,
  //     })
  //     .show();
  // }

  // 更改期刊名称
  static async chPubTitle(oldTitle: string, newTitle: string) {

    // var oldTitle = document.getElementById('id-updateifs-old-title-textbox').value.trim();
    // var newTitle = document.getElementById('id-updateifs-new-title-textbox').value.trim();
    // 如果新或老题目为空则提示
    if (oldTitle == '' || newTitle == '') {

      var alertInfo = getString('pubTitleEmpty');
      HelperExampleFactory.progressWindow(alertInfo, 'fail');

    } else {
      var items = KeyExampleFactory.getSelectedItems();
      var n = 0;
      var itemOldTitle = '';
      if (items.length == 0) {
        var alertInfo = getString('zeroItem');
        this.progressWindow(alertInfo, 'fail');
        return;
      } else {
        for (let item of items) {
          itemOldTitle = (item.getField("publicationTitle") as any).trim();//原题目
          if (oldTitle == itemOldTitle) { //如果和输入的相等则替换
            item.setField("publicationTitle", newTitle);
            await item.saveTx();
            n++;
          }
        }
        var statusInfo = n == 0 ? 'fail' : 'success';
        var whiteSpace = HelperExampleFactory.whiteSpace();
        alertInfo = n + whiteSpace + getString('successPubTitle');
        HelperExampleFactory.progressWindow(alertInfo, statusInfo);
      }
    }

  };

  // 更改期刊大小写
  static async chPubTitleCase() {
    var items: any = KeyExampleFactory.getSelectedItems();
    var whiteSpace = HelperExampleFactory.whiteSpace();
    var n = 0;
    var newPubTitle = '';
    if (items.length == 0) {
      var alertInfo = getString('zeroItem');
      this.progressWindow(alertInfo, 'fail');
      return;
    } else {
      for (let item of items) {
        var oldPubTitle = item.getField("publicationTitle").trim();//原题目
        newPubTitle = HelperExampleFactory.titleCase(oldPubTitle). //转为词首字母大写
          replace(' And ', ' and '). // 替换And
          replace(' For ', ' for '). // 替换For
          replace(' In ', ' in '). // 替换In
          replace(' Of ', ' of '). // 替换Of
          replace('Plos One', 'PLOS ONE').
          replace('Plos', 'PLOS').
          replace('Msystems', 'mSystems').
          replace('Lwt', 'LWT').
          replace('LWT-food', 'LWT-Food').
          replace('LWT - food', 'LWT - Food').
          replace('Ieee', 'IEEE').
          replace('Gida', 'GIDA').
          replace('Pnas', 'PNAS').
          replace('Iscience', 'iScience')
        item.setField("publicationTitle", newPubTitle);
        await item.saveTx();
        n++;
      }
      var statusInfo = n == 0 ? 'fail' : 'success';
      // var itemNo = n > 1 ? 'success.pub.title.mul' : 'success.pub.title.sig';
      alertInfo = n + whiteSpace + getString('successPubTitleCase');
      this.progressWindow(alertInfo, statusInfo);
    }
  }

  // 将题目改为句首字母大写
  @example
  static async chanItemTitleCase() {
    var items: any = KeyExampleFactory.getSelectedItems();
    var whiteSpace = HelperExampleFactory.whiteSpace();
    var n = 0;

    if (items.length == 0) {
      var alertInfo = getString('zeroItem');
      this.progressWindow(alertInfo, 'fail');
      return;
    } else {
      for (let item of items) {

        var title = item.getField('title');
        if (HelperExampleFactory.detectUpCase(title)) {//如果条目题目全部为大写，转换并提醒
          title = HelperExampleFactory.titleCase(title); // 转换为单词首字母大写
          alertInfo = getString('allUpcase');
          HelperExampleFactory.progressWindow(alertInfo, 'infomation');
        }

        var new_title = title.replace(/\b([A-Z][a-z0-9]+|A)\b/g, function (x: any) { return x.toLowerCase(); });
        new_title = new_title.replace(/(^|\?\s*)[a-z]/, function (x: any) { return x.toUpperCase(); }).
          replace('china', 'China'). // 替换china  代码来源于fredericky123，感谢。
          replace('chinese', 'Chinese'). // 替换chinese
          replace('america', 'America'). // 替换america
          replace('english', 'English'). // 替换english
          replace('england', 'England'). // 替换england
          replace('3d', '3D').
          replace('india', 'India'). // 替换india
          replace('dpph', 'DPPH'). // 专有名词
          replace('abts', 'ABTS'). // 专有名词
          //20220510 增加冒号后面为大写字母
          // https://stackoverflow.com/questions/72180052/regexp-match-and-replace-to-its-uppercase-in-javascript#72180194
          replace(/：|:\s*\w/, (fullMatch: string) => fullMatch.toUpperCase()); //匹配冒号后面的空格及一个字母，并转为大写
        n++;
        item.setField('title', new_title);
        await item.saveTx();
      }

    }
    var statusInfo = n == 0 ? 'fail' : 'success';
    alertInfo = n + whiteSpace + getString('successItemTitleCase');
    this.progressWindow(alertInfo, statusInfo);
  }

  // 检查句子是否为全部大写
  static detectUpCase(word: string) {
    var arr_is_uppercase = [];
    for (var char of word) {
      if (char.charCodeAt(0) < 97) {
        arr_is_uppercase.push(1);   // 是大写就加入 1
      } else {
        arr_is_uppercase.push(0);   // 是小写就加入 0
      }
    }
    var uppercase_sum = arr_is_uppercase.reduce((x, y) => x + y);
    if (
      uppercase_sum === word.length   // 全部为大写
    ) {
      return true;
    } else {
      return false;
    }
  };

  // 更新期刊缩写
  static async upJourAbb(item: Zotero.Item) {//
    // var items = ZoteroPane.getSelectedItems();
    // var item = items[0];


    // 得到期刊缩写设置
    // Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.add.update`, true);

    var upJourAbb = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.update.abbr`, true);
    var dotAbb = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.update.abbr.dot`, true);
    var enAbb = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.en.abbr`, true);
    var chAbb = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.ch.abbr`, true);

    var pattern = new RegExp("[\u4E00-\u9FA5]+");
    var title = String(item.getField("title"));
    var lan = pattern.test(title) ? 'zh-CN' : 'en-US'; // 得到条目语言
    // lan == 'en-US'英文条目
    // lan == 'zh-CN'中文条目


    // var lanItem = item.getField('language');

    // var enItem = /en|English/.test(lanItem as any)
    // var chItem = /ch|zh|中文|CN/.test(lanItem as any)

    var pubT = item.getField('publicationTitle');
    if (upJourAbb) {
      try {
        var jourAbbs = await HelperExampleFactory.getJourAbb(item); // 得到带点和不带点的缩写
      } catch (e) {
        Zotero.debug('获取期刊缩写失败');
      }
      if (jourAbbs["record"] != 0) {
        try {
          var jourAbb = dotAbb ? jourAbbs["abb_with_dot"] : jourAbbs["abb_no_dot"];
          var abb = HelperExampleFactory.titleCase(jourAbb) //改为词首字母大写
          item.setField('journalAbbreviation', abb);

        } catch (e) {
          return;
        }
        // 英文如果找不到缩写是否用全称代替
      } else if (enAbb && lan == 'en-US') {
        item.setField('journalAbbreviation', pubT);
        // 中文如果找不到缩写是否用全称代替
      } else if (chAbb && lan == 'zh-CN') {
        item.setField('journalAbbreviation', pubT);
      }
    }
    //return jourAbbs
    item.saveTx();
  };

  // 得到期刊缩写
  static async getJourAbb(item: Zotero.Item) {
    var pubT = item.getField('publicationTitle');
    var url = "https://www.linxingzhong.top/journal";
    var postData = {
      key: "journal",
      "fullname": pubT
    };
    var headers = { "Content-Type": "application/json" };
    // Maybe need to set max retry in this post request.
    var resp = await Zotero.HTTP.request("POST", url, {
      body: JSON.stringify(postData),
      headers: headers,
    });
    try {
      var record = JSON.parse(resp.responseText);
      return record;
    } catch (e) {
      return;
    }
  };



  // 作者处理函数 加粗加星
  @example
  static async auProcess(author: string, process: string) {

    var oldName = HelperExampleFactory.newNames(author, process)![0];
    var newFirstName = HelperExampleFactory.newNames(author, process)![1];
    var newLastName = HelperExampleFactory.newNames(author, process)![2];
    var newFieldMode = HelperExampleFactory.newNames(author, process)![3]; // 0: two-field, 1: one-field (with empty first name)
    var mergeedName = HelperExampleFactory.newNames(author, process)![4];
    var mergeedNameNew = HelperExampleFactory.newNames(author, process)![5];

    var rn = 0; //计数替换条目个数
    //await Zotero.DB.executeTransaction(async function () {

    var items = KeyExampleFactory.getSelectedItems();
    if (items.length == 0) { // 如果没有选中条目则提示，中止
      alertInfo = getString('zeroItem');
      HelperExampleFactory.progressWindow(alertInfo, 'fail');
    } else {
      for (let item of items) {
        let creators = item.getCreators();
        let newCreators = [];
        for (let creator of creators) {
          if (`${creator.firstName} ${creator.lastName}`.trim() == oldName) {
            (creator as any).firstName = newFirstName;
            (creator.lastName as any) = newLastName;
            (creator.fieldMode as any) = newFieldMode;
            rn++;
          }

          if (`${HelperExampleFactory.replaceBoldStar(creator.lastName as any)}`.trim() == mergeedName) { // 针对已经合并姓名的
            creator.firstName = '';
            (creator.lastName as any) = mergeedNameNew;
            (creator.fieldMode as any) = newFieldMode;
            rn++;
          }
          if (`${HelperExampleFactory.replaceBoldStar(creator.firstName as any)} ${HelperExampleFactory.replaceBoldStar(creator.lastName as any)}`.trim() == oldName) {
            (creator.firstName as any) = newFirstName;
            (creator.lastName as any) = newLastName;
            (creator.fieldMode as any) = newFieldMode;
            rn++;
          }
          newCreators.push(creator);
        }
        item.setCreators(newCreators);
        await item.save();
      }

      var whiteSpace = HelperExampleFactory.whiteSpace();
      var statusInfo = rn > 0 ? 'success' : 'fail';
      var alertInfo = `${rn} ${whiteSpace} ${getString('authorChanged')}`;
      HelperExampleFactory.progressWindow(alertInfo, statusInfo);
    }
  };

  @example
  // 返回新的名字用以替换
  static newNames(authorName: any, boldStar: any) {
    var newName = [];
    var splitName = '';
    var oldName = '';
    var newFirstName = '';
    var newLastName = '';
    // var reg = /[一-龟]/; // 匹配所有汉字
    var reg = new RegExp("[\u4E00-\u9FA5]+"); // 匹配所有汉字
    var mergeedName = '';
    var mergeedNameNew = '';
    var alertInfo = '';

    if (authorName == '') { // 如果作者为空时提示
      alertInfo = getString("authorEmpty");
      HelperExampleFactory.progressWindow(alertInfo, 'fail');
    } else if (!/\s/.test(authorName)) {  //检测输入的姓名中是否有空格,无空格提示
      alertInfo = getString("authorNoSpace");
      HelperExampleFactory.progressWindow(alertInfo, 'fail');
    } else {

      var splitName: string = authorName.split(/\s/); // 用空格分为名和姓
      var firstName = splitName[1];
      var lastName = splitName[0];
      oldName = firstName + ' ' + lastName;
      Zotero.debug(reg.test(authorName) + ': ture 为中文')
      // 检测姓名是否为中文
      if (reg.test(authorName)) { // 为真时匹配到中文
        var newFieldMode = 1;  // 1中文时为合并
        mergeedName = authorName.replace(/\s/, ''); // 中文姓名删除空格得到合并的姓名
      } else {
        newFieldMode = 0; // 0为拆分姓名，英文
        mergeedName = oldName; // 英文姓名与原姓名相同
      };

      switch (boldStar) {
        case 'boldStar':  // 加粗加星
          mergeedNameNew = '<b>' + mergeedName + '*</b>';
          newFirstName = '<b>' + firstName + '*</b>';
          newLastName = '<b>' + lastName + '</b>';
          if (reg.test(authorName)) { // 中文姓名
            newFirstName = "";
            newLastName = '<b>' + lastName + firstName + '*</b>';
          };
          break;
        case 'bold': // 仅加粗

          mergeedNameNew = '<b>' + mergeedName + '</b>';
          newFirstName = '<b>' + firstName + '</b>';
          newLastName = '<b>' + lastName + '</b>';
          if (reg.test(authorName)) { // 中文姓名
            newFirstName = "";
            newLastName = '<b>' + lastName + firstName + '</b>';
          };
          break;
        case 'star':  // 加粗加星

          mergeedNameNew = mergeedName + '*';
          newFirstName = firstName + '*';
          newLastName = lastName;
          if (reg.test(authorName)) { // 中文姓名
            newFirstName = "";
            newLastName = lastName + firstName + '*';
          };
          break;
        case 'n':
          break;

      }
      newName.push(oldName, newFirstName, newLastName, newFieldMode, mergeedName, mergeedNameNew)
      return newName;
    }

  };
  @example
  //删除作者姓名中的粗体和星号标识
  static replaceBoldStar(auName: string) {
    return auName.replace(/<b>/g, '').replace(/<\/b>/g, '').replace(/\*/g, '');
  };

  // 清除加粗
  static async cleanBold() {
    var rn = 0;
    var items = KeyExampleFactory.getSelectedItems();
    if (items.length == 0) { // 如果没有选中条目则提示，中止
      alertInfo = getString('zeroItem');
      HelperExampleFactory.progressWindow(alertInfo, 'fail');
      return;
    }
    for (let item of items) {
      let creators = item.getCreators();
      let newCreators = [];

      for (let creator of creators) {
        if (/<b>/.test(creator.firstName as any) || /<b>/.test(creator.lastName as any)) {  // 是否包含<b>

          creator.firstName = creator.firstName!.replace(/<b>/g, '').replace(/<\/b>/g, '');
          creator.lastName = creator.lastName!.replace(/<b>/g, '').replace(/<\/b>/g, '');
          creator.fieldMode = creator.fieldMode;
          rn++;
        }
        newCreators.push(creator);

      }
      item.setCreators(newCreators);

      await item.saveTx();

    }
    var whiteSpace = HelperExampleFactory.whiteSpace();
    var statusInfo = rn > 0 ? 'success' : 'fail';
    var alertInfo = `${rn} ${whiteSpace} ${getString('authorChanged')}`;
    HelperExampleFactory.progressWindow(alertInfo, statusInfo);

  };



  // 清除加星
  static async cleanStar() {
    var rn = 0;
    var items = KeyExampleFactory.getSelectedItems();
    if (items.length == 0) { // 如果没有选中条目则提示，中止
      alertInfo = getString('zeroItem');
      HelperExampleFactory.progressWindow(alertInfo, 'fail');
      return;
    }
    for (let item of items) {
      let creators = item.getCreators();
      let newCreators = [];

      for (let creator of creators) {
        if (/\*/.test(creator.firstName as any) || /\*/.test(creator.lastName as any)) {

          creator.firstName = creator.firstName!.replace(/\*/g, '');
          creator.lastName = creator.lastName!.replace(/\*/g, '');
          creator.fieldMode = creator.fieldMode;
          rn++;
        }
        newCreators.push(creator);

      }
      item.setCreators(newCreators);

      // await item.save();
      await item.saveTx()

    }
    var whiteSpace = HelperExampleFactory.whiteSpace();
    var statusInfo = rn > 0 ? 'success' : 'fail';
    var alertInfo = `${rn} ${whiteSpace} ${getString('authorChanged')}`;
    HelperExampleFactory.progressWindow(alertInfo, statusInfo);


  };

  // 清除加粗加星
  static async cleanBoldAndStar() {
    var rn = 0;
    var items = KeyExampleFactory.getSelectedItems();
    if (items.length == 0) { // 如果没有选中条目则提示，中止
      alertInfo = getString('zeroItem');
      HelperExampleFactory.progressWindow(alertInfo, 'fail');
      return;
    }
    for (let item of items) {
      let creators = item.getCreators();
      let newCreators = [];

      for (let creator of creators) {
        if (/<b>/.test(creator.firstName as any) || /<b>/.test(creator.lastName as any)
          || /\*/.test(creator.firstName as any) || /\*/.test(creator.lastName as any)) {  // 是否包含<b>

          creator.firstName = creator.firstName!.
            replace(/<b>/g, '').replace(/<\/b>/g, '').replace(/\*/g, '');
          creator.lastName = creator.lastName!.
            replace(/<b>/g, '').replace(/<\/b>/g, '').replace(/\*/g, '');

          creator.fieldMode = creator.fieldMode;
          rn++;
        }
        newCreators.push(creator);

      }
      item.setCreators(newCreators);

      await item.saveTx();

    }
    var whiteSpace = HelperExampleFactory.whiteSpace();
    var statusInfo = rn > 0 ? 'success' : 'fail';
    var alertInfo = `${rn} ${whiteSpace} ${getString('authorChanged')}`;
    HelperExampleFactory.progressWindow(alertInfo, statusInfo);

  };

  @example
  // 交换作者姓和名
  static async swapAuthorName() {
    var rn = 0; //计数替换条目个数
    //var newFieldMode = 0; // 0: two-field, 1: one-field (with empty first name)
    var items = KeyExampleFactory.getSelectedItems();
    if (items.length == 0) { // 如果没有选中条目则提示，中止
      alertInfo = getString('zeroItem');
      HelperExampleFactory.progressWindow(alertInfo, 'fail');
      return;
    } else {
      for (let item of items) {
        let creators = item.getCreators();
        let newCreators = [];
        for (let creator of creators) {
          // if (`${creator.firstName} ${creator.lastName}`.trim() == oldName) {
          let firstName = creator.firstName;
          let lastName = creator.lastName;

          creator.firstName = lastName;
          creator.lastName = firstName;
          creator.fieldMode = creator.fieldMode;
          newCreators.push(creator);
        }
        item.setCreators(newCreators);
        rn++;
        await item.save();
      }

    }
    var whiteSpace = HelperExampleFactory.whiteSpace();
    var statusInfo = rn > 0 ? 'success' : 'fail';
    var alertInfo = rn + whiteSpace + getString('itemAuSwapped');
    HelperExampleFactory.progressWindow(alertInfo, statusInfo);
  };

  // 更改作者名称大小写
  @example
  static async changAuthorCase() {
    var rn = 0; //计数替换条目个数
    // var newFieldMode = 0; // 0: two-field, 1: one-field (with empty first name)
    //await Zotero.DB.executeTransaction(async function () {
    var items = KeyExampleFactory.getSelectedItems();
    if (items.length == 0) { // 如果没有选中条目则提示，中止
      alertInfo = getString('zeroItem');
      HelperExampleFactory.progressWindow(alertInfo, 'fail');
      return;
    } else {
      for (let item of items) {
        var creators = item.getCreators();
        let newCreators = [];
        for (let creator of creators) {
          creator.firstName = HelperExampleFactory.titleCase(creator.firstName!.trim());
          creator.lastName = HelperExampleFactory.titleCase(creator.lastName!.trim());
          creator.fieldMode = creator.fieldMode;
          newCreators.push(creator);
        }
        item.setCreators(newCreators);
        await item.save();
        rn++;
      }
    }
    var whiteSpace = HelperExampleFactory.whiteSpace();
    var statusInfo = rn > 0 ? 'success' : 'fail';
    var alertInfo = `${rn} ${whiteSpace} ${getString('itemAuthorChanged')}`;
    HelperExampleFactory.progressWindow(alertInfo, statusInfo);
  };

  // 将单词转为首字母大写
  static titleCase(str: string) {
    var newStr = str.split(" ");
    for (var i = 0; i < newStr.length; i++) {
      newStr[i] = newStr[i].slice(0, 1).toUpperCase() + newStr[i].slice(1).toLowerCase();
    }
    return newStr.join(" ");
  };


  // 条目题目处理函数 条目查找替换
  @example
  static async itemTitleFindRep(oldTitle: string, newTitle: string) {
    // 如果新或老题目为空则提示
    if (oldTitle == '' || newTitle == '') {
      var alertInfo = getString('titleEmpty');
      HelperExampleFactory.progressWindow(alertInfo, 'fail');
    } else if (oldTitle == newTitle) {
      alertInfo = getString('findRepSame');
      HelperExampleFactory.progressWindow(alertInfo, 'fail');
    } else {
      var n = 0;
      var itemOldTitle = ''; // 原题目
      var replaced_title = ''; // 新题目
      var items = KeyExampleFactory.getSelectedItems();
      if (items.length == 0) { // 如果没有选中条目则提示，中止
        alertInfo = getString('zeroItem');
        HelperExampleFactory.progressWindow(alertInfo, 'fail');
        return;
      } else {
        for (let item of items) {
          itemOldTitle = (item.getField('title') as any).trim(); //原题目
          if (itemOldTitle.indexOf(oldTitle) != -1) { //如果包含原字符
            replaced_title = itemOldTitle.replace(oldTitle, newTitle);
            item.setField('title', replaced_title);
            await item.saveTx();
            n++;
          }
        }
      }
      var whiteSpace = HelperExampleFactory.whiteSpace();
      var statusInfo = n > 0 ? 'success' : 'fail';
      var alertInfo = `${n} ${whiteSpace} ${getString('itemTitleFindRepSuc')}`;
      HelperExampleFactory.progressWindow(alertInfo, statusInfo);
    }
  }


  @example
  // 作者处理对话框{
  static async dialogAuProcess() {
    var padding = '1px 1px 1px 1px';
    var margin = '1px 1px 1px 30px';
    var widthSmall = '60px';
    var widthMiddle = '90px';
    var widthLarge = '125px';
    const dialog = new ztoolkit.Dialog(5, 3)
      .addCell(0, 0, {
        tag: "h4",
        styles: {
          height: "10px",
          margin: margin,
          // border: border,
          padding: padding,
        },
        properties: { innerHTML: getString('authorProcess') },
      },
        false)
      .addCell(1, 0, {
        tag: "p",
        styles: {
          width: "460px",
          padding: padding,
          margin: margin,
          // border: border,
        },
        properties: { innerHTML: getString('authorProcessName') },
      },
        false
      )
      .addCell(2, 0,
        {
          tag: "input",
          id: "dialog-input4",
          styles: {
            width: "300px",
            margin: '10px 1px 1px 70px',
            // border: border,
          },
        },
        false
      )
      .addCell(3, 0, { //作者加粗对话框
        tag: "button",
        namespace: "html",
        styles: {
          padding: padding,
          margin: '1px 1px 1px 40px',
          // border: border,
        },
        attributes: {
          type: "button",
        },
        listeners: [
          {
            type: "click",
            listener: (e: Event) => {
              var author = (dialog.window.document.getElementById('dialog-input4') as HTMLInputElement).value;
              this.auProcess(author, 'bold');
            },
          },
        ],
        children: [
          {
            tag: "div",
            styles: {
              width: widthSmall,
              padding: padding,
            },
            properties: {
              innerHTML: getString('boldLabel'),
            },
          },
        ],
      },
        false
      )
      .addCell(3, 1, { //作者加星对话框
        tag: "button",
        styles: {
          padding: padding,
          margin: margin,

        },
        namespace: "html",
        attributes: {
          type: "button",
        },
        listeners: [
          {
            type: "click",
            listener: (e: Event) => {
              var author = (dialog.window.document.getElementById('dialog-input4') as HTMLInputElement).value;
              this.auProcess(author, 'star');
            },
          },
        ],
        children: [
          {
            tag: "div",
            styles: {
              width: widthMiddle,
              padding: padding,
            },
            properties: {
              innerHTML: getString('starLabel'),
            },
          },
        ],
      },
        false
      )
      .addCell(3, 2, { //作者加粗加星对话框
        tag: "button",
        styles: {
          padding: padding,
          margin: margin,
          // border: border,
        },
        namespace: "html",
        attributes: {
          type: "button",
        },
        listeners: [
          {
            type: "click",
            listener: (e: Event) => {
              var author = (dialog.window.document.getElementById('dialog-input4') as HTMLInputElement).value;
              this.auProcess(author, 'boldStar');
            },
          },
        ],
        children: [
          {
            tag: "div",
            styles: {
              width: widthLarge,
              padding: padding,
            },
            properties: {
              innerHTML: getString('boldStarLabel'),
            },
          },
        ],
      },
        false
      )
      .addCell(4, 0, { //作者去粗
        tag: "button",
        styles: {
          padding: padding,
          margin: '1px 1px 1px 40px',
          // border: border,
        },
        namespace: "html",
        attributes: {
          type: "button",
        },
        listeners: [
          {
            type: "click",
            listener: (e: Event) => {
              // var author = (dialog.window.document.getElementById('dialog-input4') as HTMLInputElement).value;
              HelperExampleFactory.cleanBold();
            },
          },
        ],
        children: [
          {
            tag: "div",
            styles: {
              width: widthSmall,
              padding: padding,
              // margin: '20px 20px 20px 20px',
            },
            properties: {
              innerHTML: getString('cleanBoldLabel'),
            },
          },
        ],
      },
        false
      )
      .addCell(4, 1, { //作者去星
        tag: "button",
        styles: {
          padding: padding,
          margin: margin,
          // border: border,
        },
        namespace: "html",
        attributes: {
          type: "button",
        },
        listeners: [
          {
            type: "click",
            listener: (e: Event) => {
              // var author = (dialog.window.document.getElementById('dialog-input4') as HTMLInputElement).value;
              HelperExampleFactory.cleanStar();
            },
          },
        ],
        children: [
          {
            tag: "div",
            styles: {
              width: widthMiddle,
              padding: padding,
            },
            properties: {
              innerHTML: getString('cleanStarLabel'),
            },
          },
        ],
      },
        false
      )
      .addCell(4, 2, { //作者去粗去星对话框
        tag: "button",
        styles: {
          padding: padding,
          margin: margin,
          // border: border,
        },
        namespace: "html",
        attributes: {
          type: "button",
        },
        listeners: [
          {
            type: "click",
            listener: (e: Event) => {
              // var author = (dialog.window.document.getElementById('dialog-input4') as HTMLInputElement).value;
              HelperExampleFactory.cleanBoldAndStar();
            },
          },
        ],
        children: [
          {
            tag: "div",
            styles: {
              width: widthLarge,
              padding: padding,
            },
            properties: {
              innerHTML: getString('cleanBoldStarLabel'),
            },
          },
        ],
      },
        false
      )
      // .addButton(getString('boldLabel'), "boldButton", {
      //   noClose: true,
      //   callback: (e) => {
      //     var text = (dialog.window.document.getElementById('dialog-input4') as HTMLInputElement).value;
      //     new ztoolkit.ProgressWindow(config.addonName)
      //       .createLine({
      //         text: text,
      //         type: "success",
      //         progress: 100,
      //       })
      //       .show();

      //   },
      // })
      // .setDialogData(dialogData)
      .open(getString('authorProcessDiaTitle'),
        {
          width: 500,
          height: 250,
          centerscreen: true,
          // fitContent: true,
        }
      );
  }

  @example
  // 条目题目查找替换
  static async dialogItemTitleProcess() {
    var padding = '1px 1px 1px 1px';
    const dialog = new ztoolkit.Dialog(5, 2)
      .addCell(0, 0, {
        tag: "h4",
        styles: {
          height: "10px",
          margin: '1px 1px 1px 30px',
          // border: border,
          padding: padding,
        },
        properties: { innerHTML: getString('itemTitleFindReplaceLabel') },
      },
        false)
      .addCell(1, 0, {
        tag: "p",
        styles: {
          width: "460px",
          padding: padding,
          margin: '1px 1px 1px 30px',
          // border: border,
        },
        properties: { innerHTML: getString('titleSearchReplaceLabel') },
      },
        false
      )
      .addCell(2, 0, {
        tag: "p",
        styles: {
          width: "100px",
          padding: padding,
          margin: '5px 1px 1px 30px',
          // border: border,
        },
        properties: { innerHTML: getString('titleSearLabel') },
      },
        false
      )
      .addCell(2, 1,
        {
          tag: "input",
          id: "item-title-search-input",
          styles: {
            width: "300px",
            margin: '10px 1px 1px 8px',
            // border: border,
          },
        },
        false
      )
      .addCell(3, 0, {
        tag: "p",
        styles: {
          width: "100px",
          padding: padding,
          margin: '5px 1px 1px 30px',
          // border: border,
        },
        properties: { innerHTML: getString('titleReplaceLabel') },
      },
        false
      )
      .addCell(3, 1,
        {
          tag: "input",
          id: "item-title-replace-input",
          styles: {
            width: "300px",
            margin: '10px 1px 1px 8px',
            // border: border,
          },
        },
        false
      )
      .addCell(4, 0, {
        tag: "button",
        styles: {
          padding: padding,
          margin: '1px 1px 1px 200px',
          // border: border,
        },
        namespace: "html",
        attributes: {
          type: "button",
        },
        listeners: [
          {
            type: "click",
            listener: (e: Event) => {
              var searchText = (dialog.window.document.getElementById('item-title-search-input') as HTMLInputElement).value;
              var repText = (dialog.window.document.getElementById('item-title-replace-input') as HTMLInputElement).value;
              this.itemTitleFindRep(searchText, repText);
            },
          },
        ],
        children: [
          {
            tag: "div",
            styles: {
              width: '100px',
              padding: padding,
            },
            properties: {
              innerHTML: getString('titleReplaceButton'),
            },
          },
        ],
      },
        false
      )
      .open(getString('titleSearchReplaceWin'),
        {
          width: 510,
          height: 250,
          centerscreen: true,
          // fitContent: true,
        }
      );
  }

  @example
  // 更改期刊题目对话框
  static async dialogChPubTitle() {
    var padding = '1px 1px 1px 1px';
    const dialog = new ztoolkit.Dialog(7, 1)
      .addCell(0, 0, {
        tag: "h4",
        styles: {
          height: "10px",
          margin: '1px 1px 1px 30px',
          // border: border,
          padding: padding,
        },
        properties: { innerHTML: getString('change-pub-title') },
      },
        false)
      .addCell(1, 0, {
        tag: "p",
        styles: {
          width: "460px",
          padding: padding,
          margin: '1px 1px 1px 30px',
          // border: border,
        },
        properties: { innerHTML: getString('change-pub-title-desc') },
      },
        false
      )
      .addCell(2, 0, {
        tag: "p",
        styles: {
          width: "400px",
          padding: padding,
          margin: '15px 1px 1px 80px',
          // border: border,
        },
        properties: { innerHTML: getString('old-pub-title') },
      },
        false
      )
      .addCell(3, 0,
        {
          tag: "input",
          id: "change-pub-title-old",
          styles: {
            width: "300px",
            margin: '10px 1px 1px 80px',
            // border: border,
          },
        },
        false
      )
      .addCell(4, 0, {
        tag: "p",
        styles: {
          width: "400px",
          padding: padding,
          margin: '10px 1px 1px 80px',
          // border: border,
        },
        properties: { innerHTML: getString('new-pub-title') },
      },
        false
      )
      .addCell(5, 0,
        {
          tag: "input",
          id: "change-pub-title-new",
          styles: {
            width: "300px",
            margin: '10px 1px 1px 80px',
            // border: border,
          },
        },
        false
      )
      .addCell(6, 0, {
        tag: "button",
        styles: {
          padding: padding,
          margin: '15px 1px 1px 150px',
          // border: border,
        },
        namespace: "html",
        attributes: {
          type: "button",
        },
        listeners: [
          {
            type: "click",
            listener: (e: Event) => {
              var searchText = (dialog.window.document.getElementById('change-pub-title-old') as HTMLInputElement).value;
              var repText = (dialog.window.document.getElementById('change-pub-title-new') as HTMLInputElement).value;
              this.chPubTitle(searchText, repText);
            },
          },
        ],
        children: [
          {
            tag: "div",
            styles: {
              width: '150px',
              padding: padding,
            },
            properties: {
              innerHTML: getString('change-title-bn'),
            },
          },
        ],
      },
        false
      )
      .open(getString('change-pub-title'),
        {
          width: 510,
          height: 300,
          centerscreen: true,
          // fitContent: true,
        }
      );
  }

  @example
  // 作者处理对话框：加粗、加星、去粗、去星
  static async dialogAuBoldStar() {
    const dialogData: { [key: string | number]: any } = {
      inputValue: "test",
      checkboxValue: true,
    };
    const dialog = new ztoolkit.Dialog(5, 2)
      .addCell(0, 0, {
        tag: "h1",
        properties: { innerHTML: "Helper Examples" },
      })
      .addCell(1, 0, {
        tag: "h2",
        properties: { innerHTML: "Dialog Data Binding" },
      })
      .addCell(2, 0, {
        tag: "p",
        properties: {
          innerHTML:
            "Elements with attribute 'data-bind' are binded to the prop under 'dialogData' with the same name.",
        },
        styles: {
          width: "200px",
        },
      })
      .addCell(3, 0, {
        tag: "label",
        namespace: "html",
        attributes: {
          for: "dialog-checkbox",
        },
        properties: { innerHTML: "bind:checkbox" },
      })
      .addCell(
        3,
        1,
        {
          tag: "input",
          namespace: "html",
          id: "dialog-checkbox",
          attributes: {
            "data-bind": "checkboxValue",
            "data-prop": "checked",
            type: "checkbox",
          },
          properties: { label: "Cell 1,0" },
        },
        false
      )
      .addCell(4, 0, {
        tag: "label",
        namespace: "html",
        attributes: {
          for: "dialog-input",
        },
        properties: { innerHTML: "bind:input" },
      })
      .addCell(4, 1,
        {
          tag: "input",
          id: "dialog-input4",
          // attributes: {
          //   "data-bind": "inputValue",
          //   "data-prop": "value",
          //   type: "text",
          // },
        },
        false
      )
      .addButton("Replace", "replace", {
        noClose: true,
        callback: (e) => {
          var text = (dialog.window.document.getElementById('dialog-input4') as HTMLInputElement).value;
          new ztoolkit.ProgressWindow(config.addonName)
            .createLine({
              text: text,
              type: "success",
              progress: 100,
            })
            .show();

          // ztoolkit.getGlobal("alert")(
          //   text
          // );
        },
      })
      .addButton("Close", "confirm", {
        noClose: false,
        callback: (e) => {
          ztoolkit.getGlobal("alert")(
            `Close dialog with ${dialogData._lastButtonId}.\nCheckbox: ${dialogData.checkboxValue}\nInput: ${dialogData.inputValue}.`
          );
        },
      })
      // .addButton("Close", "confirm")
      // .addButton("Cancel", "cancel")
      // .addButton("Help", "help", {
      //   noClose: true,
      //   callback: (e) => {
      //     dialogHelper.window?.alert(
      //       "Help Clicked! Dialog will not be closed."
      //     );
      //   },
      // })
      .setDialogData(dialogData)
      .open("Dialog Example",
        {
          // width: 200,
          // height: 100,
          centerscreen: true,
          fitContent: true,
        }


      );
    // await dialogData.unloadLock.promise;
    // ztoolkit.getGlobal("alert")(
    //   `Close dialog with ${dialogData._lastButtonId}.\nCheckbox: ${dialogData.checkboxValue}\nInput: ${dialogData.inputValue}.`
    // );
    // ztoolkit.log(dialogData);
  }

  /*

    @example
    static async filePickerExample() {
      const path = await new ztoolkit.FilePicker(
        "Import File",
        "open",
        [
          ["PNG File(*.png)", "*.png"],
          ["Any", "*.*"],
        ],
        "image.png"
      ).open();
      ztoolkit.getGlobal("alert")(`Selected ${path}`);
    }
  */
  //进度条
  @example
  static progressWindow(info: string, status: string) {
    new ztoolkit.ProgressWindow(config.addonName)
      .createLine({
        text: info,
        type: status,
        progress: 100,
      })
      .show();
  }

  @example
  static progressWindowExample() {
    new ztoolkit.ProgressWindow(config.addonName)
      .createLine({
        text: "ProgressWindow Example!",
        type: "success",
        progress: 100,
      })
      .show();
  }
  /*
    @example
    static vtableExample() {
      ztoolkit.getGlobal("alert")("See src/modules/preferenceScript.ts");
    }
    */
}

/*
function replaceBoldStar(firstName: string | undefined) {
  throw new Error("Function not implemented.");
}
*/
