// == Budget controller ==
let budgetController = (function () {
    let Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let calculateTotal = function (type) {
        let sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        });

        data.totals[type] = sum;
        // console.log('sum of ' + type + ': ' + data.totals[type]);
    };

    let data = {
        allItems: {
            expense: [],
            income: []
        },
        totals: {
            expense: 0,
            income: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function (type, des, val) {
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

        calculateBudget: function () {
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

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.income,
                totalExp: data.totals.expense,
                percentage: data.percentage
            };
        },

        test: function () {
            console.log(data);
        }
    };
})();


// == UI controller ==
let uiController = (function () {

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
        percentageLabel: '.budget__expenses--percentage'
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value, // will be either income or expense
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        addListItem: function (obj, type) {
            let html, newHtml, element;
            if (type === 'income') {
                element = DOMStrings.incomesContainer;
                html = '<div class="item clearfix" id="income-%id%">\n' +
                    '<div class="item__description">%description%</div>\n' +
                    '<div class="right clearfix">\n' +
                    '<div class="item__value">%value%</div>\n' +
                    '<div class="item__delete">\n' +
                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n' +
                    '</div>\n' +
                    '</div>\n' +
                    '</div>';
            } else if (type === 'expense') {
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%">\n' +
                    '<div class="item__description">%description%</div>\n' +
                    '<div class="right clearfix">\n' +
                    '<div class="item__value">%value%</div>\n' +
                    '<div class="item__percentage">21%</div>\n' +
                    '<div class="item__delete">\n' +
                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n' +
                    '</div>\n' +
                    '</div>\n' +
                    '</div>';
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function () {
            let fields, fieldsArr;

            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array) {
                current.value = '';
            });
            fieldsArr[0].focus();
        },

        displayBudget: function (obj) {
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
        },

        getDOMStrings: function () {
            return DOMStrings;
        }
    };
})();


// == Global controller ==
let controller = (function (budgetCtrl, uiCtrl) {

    let setupEventListners = function () {
        let DOM = uiCtrl.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.key === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    let updateBudget = function () {
        // let budget;
        budgetCtrl.calculateBudget();

        let budget = budgetCtrl.getBudget();

        uiCtrl.displayBudget(budget);
    };

    let ctrlAddItem = function () {
        let input, newItem;

        input = uiCtrl.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {

            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            uiCtrl.addListItem(newItem, input.type);

            uiCtrl.clearFields();

            updateBudget();
        }
    };

    return {
        init: function () {
            console.log('Application has started.');
            uiCtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
            setupEventListners();
        }
    };

})(budgetController, uiController);


controller.init();