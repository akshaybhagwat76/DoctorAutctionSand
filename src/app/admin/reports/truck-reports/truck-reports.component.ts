import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/shared/services/admin.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-truck-reports',
  templateUrl: './truck-reports.component.html',
  styleUrls: ['./truck-reports.component.css']
})
export class TruckReportsComponent implements OnInit {

  isListLoading: boolean = false;
  reportList: any[] = [];
  dateFilter: string = 'past24Hour';
  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.listReports();
  }

  listReports() {
    this.isListLoading = true;
    this.adminService.getTruckReports(`?date_filter=${this.dateFilter}`).subscribe(
      (success) => {
        this.isListLoading = false;
        console.log(success);
        this.reportList = success.result;
      },
      (error) => {
        this.isListLoading = false;
        console.log(error);
        this.reportList = [];
      }
    );
  }

  exportReports() {
    this.adminService.exportTruckReports(`?date_filter=${this.dateFilter}`).subscribe(
      (success) => {
        saveAs(success, new Date().toDateString().split(" ").join("") + '_truck_report.csv');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  handleFilterClick(type: string) {
    this.dateFilter = type;
    this.listReports();
  }

}
