import "@patternfly/patternfly/patternfly-base.css";

// python3 -c """import glob;
// for folder in ['layouts', 'utilities', 'components']:
//  for filename in glob.iglob('./node_modules/@patternfly/patternfly/{}/**/*.css'.format(folder), recursive=True):
//    print('import \"{}\";'.format(filename.replace('./node_modules/', '')))"""
// import "@patternfly/patternfly/layouts/Bullseye/bullseye.css";
// import "@patternfly/patternfly/layouts/Flex/flex.css";
// import "@patternfly/patternfly/layouts/Gallery/gallery.css";
// import "@patternfly/patternfly/layouts/Grid/grid.css";
// import "@patternfly/patternfly/layouts/Level/level.css";
// import "@patternfly/patternfly/layouts/Split/split.css";
// import "@patternfly/patternfly/layouts/Stack/stack.css";
// import "@patternfly/patternfly/utilities/Accessibility/accessibility.css";
// import "@patternfly/patternfly/utilities/Alignment/alignment.css";
import "@patternfly/patternfly/utilities/BackgroundColor/BackgroundColor.css";
// import "@patternfly/patternfly/utilities/BoxShadow/box-shadow.css";
import "@patternfly/patternfly/utilities/Display/display.css";
import "@patternfly/patternfly/utilities/Flex/flex.css";
// import "@patternfly/patternfly/utilities/Float/float.css";
// import "@patternfly/patternfly/utilities/Sizing/sizing.css";
import "@patternfly/patternfly/utilities/Spacing/spacing.css";
// import "@patternfly/patternfly/utilities/Text/text.css";
// import "@patternfly/patternfly/components/AboutModalBox/about-modal-box.css";
// import "@patternfly/patternfly/components/Accordion/accordion.css";
// import "@patternfly/patternfly/components/ActionList/action-list.css";
// import "@patternfly/patternfly/components/AlertGroup/alert-group.css";
// import "@patternfly/patternfly/components/Alert/alert.css";
// import "@patternfly/patternfly/components/AppLauncher/app-launcher.css";
// import "@patternfly/patternfly/components/Avatar/avatar.css";
// import "@patternfly/patternfly/components/BackToTop/back-to-top.css";
// import "@patternfly/patternfly/components/Backdrop/backdrop.css";
// import "@patternfly/patternfly/components/BackgroundImage/background-image.css";
// import "@patternfly/patternfly/components/Badge/badge.css";
// import "@patternfly/patternfly/components/Banner/banner.css";
// import "@patternfly/patternfly/components/Brand/brand.css";
// import "@patternfly/patternfly/components/Breadcrumb/breadcrumb.css";
// import "@patternfly/patternfly/components/Button/button.css";
// import "@patternfly/patternfly/components/CalendarMonth/calendar-month.css";
// import "@patternfly/patternfly/components/Card/card.css";
// import "@patternfly/patternfly/components/Check/check.css";
// import "@patternfly/patternfly/components/ChipGroup/chip-group.css";
// import "@patternfly/patternfly/components/Chip/chip.css";
// import "@patternfly/patternfly/components/ClipboardCopy/clipboard-copy.css";
// import "@patternfly/patternfly/components/CodeBlock/code-block.css";
// import "@patternfly/patternfly/components/CodeEditor/code-editor.css";
// import "@patternfly/patternfly/components/Content/content.css";
// import "@patternfly/patternfly/components/ContextSelector/context-selector.css";
// import "@patternfly/patternfly/components/DataList/data-list-grid.css";
// import "@patternfly/patternfly/components/DataList/data-list.css";
// import "@patternfly/patternfly/components/DatePicker/date-picker.css";
// import "@patternfly/patternfly/components/DescriptionList/description-list-order.css";
// import "@patternfly/patternfly/components/DescriptionList/description-list.css";
// import "@patternfly/patternfly/components/Divider/divider.css";
// import "@patternfly/patternfly/components/DragDrop/drag-drop.css";
// import "@patternfly/patternfly/components/Drawer/drawer.css";
// import "@patternfly/patternfly/components/Dropdown/dropdown.css";
import "@patternfly/patternfly/components/DualListSelector/dual-list-selector.css";
// import "@patternfly/patternfly/components/EmptyState/empty-state.css";
// import "@patternfly/patternfly/components/ExpandableSection/expandable-section.css";
// import "@patternfly/patternfly/components/FileUpload/file-upload.css";
// import "@patternfly/patternfly/components/FormControl/form-control.css";
// import "@patternfly/patternfly/components/Form/form.css";
// import "@patternfly/patternfly/components/HelperText/helper-text.css";
// import "@patternfly/patternfly/components/Hint/hint.css";
// import "@patternfly/patternfly/components/InlineEdit/inline-edit.css";
// import "@patternfly/patternfly/components/InputGroup/input-group.css";
// import "@patternfly/patternfly/components/JumpLinks/jump-links.css";
// import "@patternfly/patternfly/components/LabelGroup/label-group.css";
// import "@patternfly/patternfly/components/Label/label.css";
// import "@patternfly/patternfly/components/List/list.css";
// import "@patternfly/patternfly/components/LogViewer/log-viewer.css";
// import "@patternfly/patternfly/components/Login/login.css";
// import "@patternfly/patternfly/components/Masthead/masthead.css";
// import "@patternfly/patternfly/components/MenuToggle/menu-toggle.css";
// import "@patternfly/patternfly/components/Menu/menu.css";
// import "@patternfly/patternfly/components/ModalBox/modal-box.css";
// import "@patternfly/patternfly/components/MultipleFileUpload/multiple-file-upload.css";
// import "@patternfly/patternfly/components/Nav/nav.css";
// import "@patternfly/patternfly/components/NotificationBadge/notification-badge.css";
// import "@patternfly/patternfly/components/NotificationDrawer/notification-drawer.css";
// import "@patternfly/patternfly/components/NumberInput/number-input.css";
// import "@patternfly/patternfly/components/OptionsMenu/options-menu.css";
// import "@patternfly/patternfly/components/OverflowMenu/overflow-menu.css";
// import "@patternfly/patternfly/components/Page/page.css";
// import "@patternfly/patternfly/components/Pagination/pagination.css";
// import "@patternfly/patternfly/components/Panel/panel.css";
// import "@patternfly/patternfly/components/Popover/popover.css";
// import "@patternfly/patternfly/components/ProgressStepper/progress-stepper.css";
// import "@patternfly/patternfly/components/Progress/progress.css";
// import "@patternfly/patternfly/components/Radio/radio.css";
// import "@patternfly/patternfly/components/SearchInput/search-input.css";
// import "@patternfly/patternfly/components/Select/select.css";
// import "@patternfly/patternfly/components/Sidebar/sidebar.css";
// import "@patternfly/patternfly/components/SimpleList/simple-list.css";
// import "@patternfly/patternfly/components/Skeleton/skeleton.css";
// import "@patternfly/patternfly/components/SkipToContent/skip-to-content.css";
// import "@patternfly/patternfly/components/Slider/slider.css";
// import "@patternfly/patternfly/components/Spinner/spinner.css";
// import "@patternfly/patternfly/components/Switch/switch.css";
// import "@patternfly/patternfly/components/TabContent/tab-content.css";
// import "@patternfly/patternfly/components/Table/table-grid.css";
// import "@patternfly/patternfly/components/Table/table-scrollable.css";
// import "@patternfly/patternfly/components/Table/table-tree-view.css";
import "@patternfly/patternfly/components/Table/table.css";
import "@patternfly/patternfly/components/Tabs/tabs.css";
// import "@patternfly/patternfly/components/TextInputGroup/text-input-group.css";
// import "@patternfly/patternfly/components/Tile/tile.css";
// import "@patternfly/patternfly/components/Title/title.css";
// import "@patternfly/patternfly/components/ToggleGroup/toggle-group.css";
// import "@patternfly/patternfly/components/Toolbar/toolbar.css";
// import "@patternfly/patternfly/components/Tooltip/tooltip.css";
// import "@patternfly/patternfly/components/TreeView/tree-view.css";
// import "@patternfly/patternfly/components/Truncate/truncate.css";
// import "@patternfly/patternfly/components/Wizard/wizard.css";

// DCI custom css
import "ui/css/alignment.css";
import "ui/css/spacing.css";
import "ui/css/flex.css";
