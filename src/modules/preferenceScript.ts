import { config } from "../../package.json";
import { getString } from "./locale";
import {
  BasicExampleFactory,
  HelperExampleFactory,
  KeyExampleFactory,
  PromptExampleFactory,
  UIExampleFactory,
} from "./examples";

export function registerPrefsScripts(_window: Window) {
  // This function is called when the prefs window is opened
  // See addon/chrome/content/preferences.xul onpaneload
  if (!addon.data.prefs) {
    addon.data.prefs = {
      window: _window,
      columns: [
        {
          dataKey: "title",
          label: "prefs.table.title",
          fixedWidth: true,
          width: 100,
        },
        {
          dataKey: "detail",
          label: "prefs.table.detail",
        },
      ],
      rows: [
        {
          title: "Orange",
          detail: "It's juicy",
        },
        {
          title: "Banana",
          detail: "It's sweet",
        },
        {
          title: "Apple",
          detail: "I mean the fruit APPLE",
        },
      ],
    };
  } else {
    addon.data.prefs.window = _window;
  }
  updatePrefsUI();
  bindPrefEvents();
}

async function updatePrefsUI() {
  // You can initialize some UI elements on prefs window
  // with addon.data.prefs.window.document
  // Or bind some events to the elements
  const renderLock = ztoolkit.getGlobal("Zotero").Promise.defer();
  const tableHelper = new ztoolkit.VirtualizedTabel(addon.data.prefs?.window!)
    .setContainerId(`${config.addonRef}-table-container`)
    .setProp({
      id: `${config.addonRef}-prefs-table`,
      // Do not use setLocale, as it modifies the Zotero.Intl.strings
      // Set locales directly to columns
      columns: addon.data.prefs?.columns.map((column) =>
        Object.assign(column, {
          label: getString(column.label) || column.label,
        })
      ),
      showHeader: true,
      multiSelect: true,
      staticColumns: true,
      disableFontSizeScaling: true,
    })
    .setProp("getRowCount", () => addon.data.prefs?.rows.length || 0)
    .setProp(
      "getRowData",
      (index) =>
        addon.data.prefs?.rows[index] || {
          title: "no data",
          detail: "no data",
        }
    )
    // Show a progress window when selection changes
    .setProp("onSelectionChange", (selection) => {
      new ztoolkit.ProgressWindow(config.addonName)
        .createLine({
          text: `Selected line: ${addon.data.prefs?.rows
            .filter((v, i) => selection.isSelected(i))
            .map((row) => row.title)
            .join(",")}`,
          progress: 100,
        })
        .show();
    })
    // When pressing delete, delete selected line and refresh table.
    // Returning false to prevent default event.
    .setProp("onKeyDown", (event: KeyboardEvent) => {
      if (event.key == "Delete" || (Zotero.isMac && event.key == "Backspace")) {
        addon.data.prefs!.rows =
          addon.data.prefs?.rows.filter(
            (v, i) => !tableHelper.treeInstance.selection.isSelected(i)
          ) || [];
        tableHelper.render();
        return false;
      }
      return true;
    })
    // For find-as-you-type
    .setProp(
      "getRowString",
      (index) => addon.data.prefs?.rows[index].title || ""
    )
    // Render the table.
    .render(-1, () => {
      renderLock.resolve();
    });
  await renderLock.promise;
  ztoolkit.log("Preference table rendered!");
}

function bindPrefEvents() {

  // 监听首选项中各个checkbox的变化

  // update journal abbr
  // 当更新期刊禁用时，禁用期刊是否带点选项
  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-update-abbr`
    )
    ?.addEventListener("command", (e) => {
      ztoolkit.log(e);
      UIExampleFactory.disableUppJourAbbDot();

    });

  // JCR
  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-jcr-qu`
    )
    ?.addEventListener("command", (e) => {
      ztoolkit.log(e);
      UIExampleFactory.registerExtraColumn();

    });

  // CAS基础版
  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-basic`
    )
    ?.addEventListener("command", (e) => {
      ztoolkit.log(e);
      UIExampleFactory.registerExtraColumn();
    });
  // CAS升级
  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-updated`
    )
    ?.addEventListener("command", (e) => {
      ztoolkit.log(e);
      UIExampleFactory.registerExtraColumn();
    });
  // IF5
  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-sci-if5`
    )
    ?.addEventListener("command", (e) => {
      ztoolkit.log(e);
      UIExampleFactory.registerExtraColumn();
    });
  // CSCD
  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-chjcscd`
    )
    ?.addEventListener("command", (e) => {
      ztoolkit.log(e);
      UIExampleFactory.registerExtraColumn();
    });
  // NJU 核心，CSSCI
  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-nju-core`
    )
    ?.addEventListener("command", (e) => {
      ztoolkit.log(e);
      UIExampleFactory.registerExtraColumn();
    });
  // EI
  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-ei`
    )
    ?.addEventListener("command", (e) => {
      ztoolkit.log(e);
      UIExampleFactory.registerExtraColumn();
    });
  // 中文核心期刊
  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-pku-core`
    )
    ?.addEventListener("command", (e) => {
      ztoolkit.log(e);
      UIExampleFactory.registerExtraColumn();
    });
  // 科技核心
  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-sci-core`
    )
    ?.addEventListener("command", (e) => {
      ztoolkit.log(e);
      UIExampleFactory.registerExtraColumn();
    });
  // ssci
  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-ssci`
    )
    ?.addEventListener("command", (e) => {
      ztoolkit.log(e);
      UIExampleFactory.registerExtraColumn();
    });
  // ajg
  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-ajg`
    )
    ?.addEventListener("command", (e) => {
      ztoolkit.log(e);
      UIExampleFactory.registerExtraColumn();
    });
  // utd24
  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-utd24`
    )
    ?.addEventListener("command", (e) => {
      ztoolkit.log(e);
      UIExampleFactory.registerExtraColumn();
    });
  // ft50
  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-ft50`
    )
    ?.addEventListener("command", (e) => {
      ztoolkit.log(e);
      UIExampleFactory.registerExtraColumn();
    });

  // ccf
  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-ccf`
    )
    ?.addEventListener("command", (e) => {
      ztoolkit.log(e);
      UIExampleFactory.registerExtraColumn();
    });
  // fms
  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-fms`
    )
    ?.addEventListener("command", (e) => {
      ztoolkit.log(e);
      UIExampleFactory.registerExtraColumn();
    });
  // jci
  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-jci`
    )
    ?.addEventListener("command", (e) => {
      ztoolkit.log(e);
      UIExampleFactory.registerExtraColumn();
    });
  // ahci
  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-ahci`
    )
    ?.addEventListener("command", (e) => {
      ztoolkit.log(e);
      UIExampleFactory.registerExtraColumn();
    });

  // 复合影响因子
  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-com-if`
    )
    ?.addEventListener("command", (e) => {
      ztoolkit.log(e);
      UIExampleFactory.registerExtraColumn();
    });
  // 综合影响因子
  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-agg-if`
    )
    ?.addEventListener("command", (e) => {
      ztoolkit.log(e);
      UIExampleFactory.registerExtraColumn();
    });
  // 南农核心
  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-njau-core`
    )
    ?.addEventListener("command", (e) => {
      ztoolkit.log(e);
      UIExampleFactory.registerExtraColumn();
    });
  // 南农高质量期刊
  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-njau-high-quality`
    )
    ?.addEventListener("command", (e) => {
      ztoolkit.log(e);
      UIExampleFactory.registerExtraColumn();
    });
  // 影响因子
  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-sci-if`
    )
    ?.addEventListener("command", (e) => {
      ztoolkit.log(e);
      UIExampleFactory.registerExtraColumn();
    });

  // 禁用添加新条目自动更新
  (addon.data
    .prefs!.window.document.getElementById(
      `zotero-prefpane-${config.addonRef}-add-update`
    ) as any).disabled = false;

  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-enable`
    )
    ?.addEventListener("command", (e) => {
      ztoolkit.log(e);
      addon.data.prefs!.window.alert(
        `Successfully changed to ${(e.target as XUL.Checkbox).checked}!`
      );
    });

  addon.data
    .prefs!!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-input`
    )
    ?.addEventListener("change", (e) => {
      ztoolkit.log(e);
      addon.data.prefs!.window.alert(
        `Successfully changed to ${(e.target as HTMLInputElement).value}!`
      );
    });
}
