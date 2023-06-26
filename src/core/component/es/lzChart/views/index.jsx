// import ChartObj from './charts'
import Bar from './Bar'
import Bubble from './Bubble'
import Column from './Column'
import Line from './Line'
import Pie from './Pie'
import PivotTable from './PivotTable'
import Scatter from './Scatter'
import StackedBar from './StackedBar'
import StackedColumn from './StackedColumn'

class Views {
    static getFactory(driver, data = {}) {
        switch (driver) {
            case 'Bar':
                return new Bar(driver, data)

            case 'StackedBar':
                return new StackedBar(driver, data)

            case 'Column':
                return new Column(driver, data)

            case 'StackedColumn':
                return new StackedColumn(driver, data)

            case 'Line':
                return new Line(driver, data)

            case 'Pie':
                return new Pie(driver, data)

            case 'Scatter':
                return new Scatter(driver, data)

            case 'Bubble':
                return new Bubble(driver, data)

            case 'PivotTable':
                return new PivotTable(driver, data)

            default:
                break
        }
    }
}

export default Views
