/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import userEvent from '@testing-library/user-event';
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";
import { ROUTES } from "../constants/routes";
import Bills from "../containers/Bills.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {

    xtest("Then mail icon in vertical layout should be highlighted", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const iconMail = await screen.getByTestId("icon-mail")
      //to-do write expect expression
      expect(iconMail.classList.contains('active-icon')).toBe(true)

    })

    test("Then ...", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      const title = await screen.getByText("Envoyer une note de frais")
      expect(title).toBeTruthy()
      const fieldDate = await screen.getByText("Date")
      expect(fieldDate).toBeTruthy()
    })

    test("Then It should renders new bill page", () => {
      document.body.innerHTML = NewBillUI();

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: 'user@example.com'
      }))
      
      jest.spyOn(window.localStorage, 'setItem');
      

      const inputExpenseType = screen.getByTestId("expense-type");
      const inputExpenseName = screen.getByTestId("expense-name");
      fireEvent.change(inputExpenseName, { target: { value: "Vol Paris Londres" } });
      const inputDatePicker = screen.getByTestId("datepicker");
      fireEvent.change(inputDatePicker, { target: { value: "2022-02-02" } });
      const inputAmount = screen.getByTestId("amount");
      fireEvent.change(inputAmount, { target: { value: "270" } });
      //const inputVat = screen.getByTestId("vat");
      //fireEvent.change(inputExpenseName, { target: { value: "Vol Paris Londres" } });
      const inputPct = screen.getByTestId("pct");
      fireEvent.change(inputPct, { target: { value: "20" } });
      const inputCommentary = screen.getByTestId("commentary");
      fireEvent.change(inputCommentary, { target: { value: " test test" } });
      const inputFile = screen.getByTestId("file");
      //const img = new Image;img.src = "img.jpg"
      //fireEvent.change(inputFile, { target: { value: "c:\git\file.jpg" } });

      const form = screen.getByTestId("form-new-bill");

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const newBill = new NewBill({
        document, onNavigate, store: null, localStorage: window.localStorage
      })

      const handleSubmit = jest.fn(newBill.handleSubmit);
      NewBill.handleSubmit = jest.fn().mockResolvedValue({});
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(handleSubmit).toHaveBeenCalled();
      //expect(window.localStorage.setItem).toHaveBeenCalled();
      
    });



    test("Then the user upload an image", async () => {
      document.body.innerHTML = NewBillUI();
      
      const inputFile = screen.getByTestId("file");
      console.log("🚀 ~ file: NewBill.js:92 ~ test ~ inputFile:", inputFile)
      const imageFile = new File(["hello"], "hello.png", { type: "image/png" });
      //fireEvent.change(inputFile, { target: { value: imageFile } });

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname});
      };

      const newBill = new NewBill({
        document, onNavigate, store: null, localStorage: window.localStorage
      })

      
      const bills = new Bills({
        document, onNavigate, store: null, localStorage: window.localStorage
      })

      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      NewBill.handleChangeFile = jest.fn().mockResolvedValue({});
      await userEvent.upload(inputFile, imageFile);
      // Make sure the action was successful
      //expect(inputFile.files.length).toBe(1);
      //let findText = await waitFor(() => screen.getByText(`Mes notes de frais`) )
      //expect(findText).toBeTruthy()
    })
  })
})
