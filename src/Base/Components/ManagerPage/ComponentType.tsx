class ComponentType {
  static INPUT: string = 'INPUT';
  static NUMBER_INPUT: string = 'NUMBER_INPUT';

  static DATE_PICKER: string = 'DATE_PICKER';

  static RANGE_PICKER: string = 'RANGE_PICKER';
}


class ListType {
  public dataSource: any[];
  public labelField: string;
  public valueField: string;

  constructor(dataSource: any[], labelFiled: string, valueField: string) {
    this.dataSource = dataSource;
    this.labelField = labelFiled;
    this.valueField = valueField;
  }
}

class RadioType extends ListType {

}

class SelectType extends ListType {

}

export {
  ComponentType,
  SelectType,
  RadioType,
}

