import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  myForm!: FormGroup;
  // Created static form defination with the field name, data type, order, constition & defalt value 
  formData = {
    "fields": [
      {
        "name": "field1",
        "dataType": "number",
        "order": 2,
        "conditions": "field1 >= 10",
        "value": 1234567890
      },
      {
        "name": "field2",
        "dataType": "text",
        "order": 1,
        "conditions": "field2 != ''",
        "value": "abc"
      },
      {
        "name": "field3",
        "dataType": "text",
        "order": 3,
        "conditions": "field1 >= 10 && field2 != ''",
        "value": "hello"
      },
      {
        "name": "field4",
        "dataType": "text",
        "order": 4,
        "conditions": "field4 != ''",
        "value": "hello"
      }
    ]
  };
  sortedFields: any;
  submitted: boolean = false;
  validation: any;

    constructor(private formBuilder: FormBuilder) { }
    // Grouping the form fields using FormGroup
    ngOnInit() {
      this.sortedFields = this.formData.fields.sort((a, b) => a.order - b.order);
      let formGroup: any = {}
        this.formData.fields.forEach(control => {
          if (control.name == "field1") {
            this.validation = [ Validators.minLength(10), Validators.required]
          } else{
            this.validation = [Validators.required]
          }
          formGroup[control.name] = [control.value || '', this.validation];
        });
      this.myForm = this.formBuilder.group(formGroup);
    }
    
    // adding the condition for the field3 (field1 >= 10 && field2 != '')

    isFieldVisible(fieldName: string): boolean {
      const field = this.formData.fields.find(f => f.name === fieldName);
      if (field && field.conditions) {
        if (field.conditions === "field1 >= 10 && field2 != ''") {
          const field1Control = this.myForm.get("field1");
          const field2Control = this.myForm.get("field2");
    
          if (field1Control && field2Control && field1Control.value && field2Control.value) {
            const field1Value = field1Control.value.toString().length;
            const field2Value = field2Control.value;
            if (field2Value && field1Value >= 10) {
              return true;
            }
            else{
              return false;
            }
            
          }
        } else{
          return true;
        }
      }
      return false;
    }

    // Onsubmit updating the field values 
    onSubmit() {
      this.submitted = true;
      if (this.myForm.valid) {
        const formValues = this.myForm.value;
        
        this.formData.fields.forEach((field:any) => {
          if (formValues[field.name] !== undefined) {
            field.value = formValues[field.name];
          }
        });
        // check the console for the updates form defination
        console.log(this.formData);
      } else {
        console.log("Something went wrong");
        setTimeout(()=>{
          this.submitted = false;
        }, 2000)
      }
    }

}
