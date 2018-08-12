// == Budget controller ==
let budgetController = (function() {
  let Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  let Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let calculateTotal = function(type) {
    let sum = 0;
    data.allItems[type].forEach(function(cur) {
      sum += cur.value;
    });

    data.totals[type] = sum;
    // console.log('sum of ' + type + ': ' + data.totals[type]);
  };

  let data = {
    allItems: {
      expense: [], income: []
    }, totals: {
      expense: 0, income: 0
    }, budget: 0, percentage: -1
  };

  return {
    addItem: function(type, des, val) {
      let newItem, ID;

      // Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      if (type === 'expense') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'income') {
        newItem = new Income(ID, des, val);
      }

      // Push the new item into our data structure
      data.allItems[type].push(newItem);
      return newItem;
    },

    deleteItem: function(type, id) {
      let ids, index;
      ids = data.allItems[type].map(function(current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function() {
      calculateTotal('expense');
      calculateTotal('income');

      data.budget = data.totals.income - data.totals.expense;
      // console.log('income: ' + data.totals.income);
      // console.log('expense: ' + data.totals.expense);
      // console.log('budget: ' + data.budget);

      if (data.totals.income > 0) {
        data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentages: function() {
      data.allItems.expense.forEach(function(cur) {
        cur.calcPercentage(data.totals.income);
      });
    },

    getPercentages: function() {
      let allPercentages = data.allItems.expense.map(function(cur) {
        return cur.getPercentage();
      });
      return allPercentages;
    },

    getBudget: function() {
      return {
        budget: data.budget, totalInc: data.totals.income, totalExp: data.totals.expense, percentage: data.percentage
      };
    },

    test: function() {
      console.log(data);
    }
  };
})();

// == UI controller ==
let uiController = (function() {

  let DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomesContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };

  let formatNumber = function(num, type) {
    let numSplit, int, dec;

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');
    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    }

    dec = numSplit[1];

    return (type === 'expense' ? '-' : '+') + ' ' + int + '.' + dec;
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value, // will be either income or expense
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      };
    },

    addListItem: function(obj, type) {
      let html, newHtml, element;
      if (type === 'income') {
        element = DOMStrings.incomesContainer;
        html = '<div class="item clearfix" id="income-%id%">\n' + '<div class="item__description">%description%</div>\n'
            + '<div class="right clearfix">\n' + '<div class="item__value">%value%</div>\n'
            + '<div class="item__delete">\n'
            + '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n' + '</div>\n'
            + '</div>\n' + '</div>';
      } else if (type === 'expense') {
        element = DOMStrings.expensesContainer;
        html = '<div class="item clearfix" id="expense-%id%">\n'
            + '<div class="item__description">%description%</div>\n' + '<div class="right clearfix">\n'
            + '<div class="item__value">%value%</div>\n' + '<div class="item__percentage">21%</div>\n'
            + '<div class="item__delete">\n'
            + '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n' + '</div>\n'
            + '</div>\n' + '</div>';
      }

      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem: function(selectorID) {
      let el;
      el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    clearFields: function() {
      let fields, fieldsArr;

      fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(current, index, array) {
        current.value = '';
      });
      fieldsArr[0].focus();
    },

    displayBudget: function(obj) {

      let type;
      obj.budget > 0 ? type = 'income' : type = 'expense';

      document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'income');
      document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'expense');

      if (obj.percentage > 0) {
        document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = '---';
      }
    },

    displayPercentages: function(percentages) {

      let fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

      let nodeListForEach = function(list, callback) {
        for (let i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };

      nodeListForEach(fields, function(current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
      });
    },

    displayMonth: function() {
      let now, months, month, year;
      now = new Date();
      // let christmas = new Date(2018, 12, 25);
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      month = now.getMonth();
      year = now.getFullYear();
      document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
    },

    getDOMStrings: function() {
      return DOMStrings;
    }
  };
})();

// == Global controller ==
let controller = (function(budgetCtrl, uiCtrl) {

  let setupEventListners = function() {
    let DOM = uiCtrl.getDOMStrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
      if (event.key === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
  };

  let updateBudget = function() {
    // let budget;
    budgetCtrl.calculateBudget();

    let budget = budgetCtrl.getBudget();

    uiCtrl.displayBudget(budget);
  };

  let updatePercentages = function() {
    budgetCtrl.calculatePercentages();

    let percentages = budgetCtrl.getPercentages();

    uiCtrl.displayPercentages(percentages);
  };

  let ctrlAddItem = function() {
    let input, newItem;

    input = uiCtrl.getInput();

    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {

      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      uiCtrl.addListItem(newItem, input.type);

      uiCtrl.clearFields();

      updateBudget();

      updatePercentages();
    }
  };

  let ctrlDeleteItem = function(event) {
    let itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      budgetCtrl.deleteItem(type, ID);

      uiCtrl.deleteListItem(itemID);

      updateBudget();

      updatePercentages();
    }
  };

  return {
    init: function() {
      console.log('Application has started.');
      uiCtrl.displayMonth();
      uiCtrl.displayBudget({
        budget: 0, totalInc: 0, totalExp: 0, percentage: -1
      });
      setupEventListners();
    }
  };

})(budgetController, uiController);

controller.init();